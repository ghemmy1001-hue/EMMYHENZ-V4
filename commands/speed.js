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

module.exports = {
  name: 'speed',
  description: 'Change video playback speed',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const video = quoted?.videoMessage;

    if (!video) {
      return sock.sendMessage(sender, {
        text: '⚡ Reply to a video with:\n.speed 1.5'
      });
    }

    const speed = Number(args[0] || 1);

    if (!Number.isFinite(speed) || speed <= 0 || speed > 4) {
      return sock.sendMessage(sender, {
        text: '❌ Speed must be between 0.25 and 4.'
      });
    }

    const id = Date.now();

    const input =
      path.join(__dirname, '..', `speed-input-${id}.mp4`);

    const output =
      path.join(__dirname, '..', `speed-output-${id}.mp4`);

    try {
      const buffer = await download(video, 'video');

      fs.writeFileSync(input, buffer);

      const videoFilter = `setpts=${(1 / speed).toFixed(6)}*PTS`;

      await run('ffmpeg', [
        '-y',
        '-i', input,
        '-vf', videoFilter,
        '-an',
        output
      ]);

      await sock.sendMessage(sender, {
        video: fs.readFileSync(output),
        caption: `⚡ Speed changed to ${speed}x.`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Speed processing failed:\n${error.message}`
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
