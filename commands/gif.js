const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

function run(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout);
    });
  });
}

async function download(media, type) {
  const stream = await downloadContentFromMessage(media, type);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'gif',
  description: 'Convert a quoted video to GIF',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const video = quoted?.videoMessage;

    if (!video) {
      return sock.sendMessage(sender, {
        text: '🎞️ Reply to a video with .gif'
      });
    }

    const id = Date.now();
    const input = path.join(__dirname, '..', `gif-${id}.mp4`);
    const output = path.join(__dirname, '..', `gif-${id}.gif`);

    try {
      const buffer = await download(video, 'video');
      fs.writeFileSync(input, buffer);

      await run('ffmpeg', [
        '-y',
        '-i', input,
        '-vf', 'fps=12,scale=480:-1:flags=lanczos',
        '-loop', '0',
        output
      ]);

      await sock.sendMessage(sender, {
        video: fs.readFileSync(output),
        gifPlayback: true,
        caption: '🎞️ GIF created.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ GIF conversion failed.\n\nMake sure FFmpeg is installed.\n\n${error.message}`
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
