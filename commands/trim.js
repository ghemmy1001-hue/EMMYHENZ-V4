const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

function run(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) reject(new Error(stderr || error.message));
      else resolve(stdout);
    });
  });
}

async function download(media, type) {
  const stream = await downloadContentFromMessage(media, type);
  const chunks = [];

  for await (const chunk of stream) chunks.push(chunk);

  return Buffer.concat(chunks);
}

function time(value) {
  if (/^\d+$/.test(value)) return Number(value);

  const parts = value.split(':').map(Number);

  if (parts.some(Number.isNaN)) return null;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 +
           parts[1] * 60 +
           parts[2];
  }

  return null;
}

module.exports = {
  name: 'trim',
  description: 'Trim a quoted video or audio',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const media =
      quoted?.videoMessage ||
      quoted?.audioMessage;

    if (!media) {
      return sock.sendMessage(sender, {
        text: '✂️ Reply to a video/audio with:\n.trim 00:00 00:10'
      });
    }

    if (args.length < 2) {
      return sock.sendMessage(sender, {
        text: '❌ Usage:\n.trim 00:00 00:10'
      });
    }

    const start = time(args[0]);
    const end = time(args[1]);

    if (start === null || end === null || end <= start) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid start/end time.'
      });
    }

    const id = Date.now();

    const input = path.join(
      __dirname,
      '..',
      `trim-input-${id}`
    );

    const output = path.join(
      __dirname,
      '..',
      `trim-output-${id}.mp4`
    );

    try {
      const type = media === quoted.videoMessage
        ? 'video'
        : 'audio';

      const buffer = await download(media, type);

      fs.writeFileSync(input, buffer);

      await run('ffmpeg', [
        '-y',
        '-ss', String(start),
        '-i', input,
        '-t', String(end - start),
        output
      ]);

      if (type === 'video') {
        await sock.sendMessage(sender, {
          video: fs.readFileSync(output),
          caption: '✂️ Video trimmed successfully.'
        });
      } else {
        await sock.sendMessage(sender, {
          audio: fs.readFileSync(output),
          mimetype: 'audio/mp4',
          fileName: 'trimmed.mp4'
        });
      }

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Trim failed:\n${error.message}`
      });

    } finally {
      for (const file of [input, output]) {
        try {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch {}
      }
    }
  }
};
