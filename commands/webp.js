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

async function download(media) {
  const stream = await downloadContentFromMessage(media, 'image');
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'webp',
  description: 'Convert a quoted image to WebP',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const image = quoted?.imageMessage;

    if (!image) {
      return sock.sendMessage(sender, {
        text: '🖼️ Reply to an image with .webp'
      });
    }

    const id = Date.now();
    const input = path.join(__dirname, '..', `webp-${id}.jpg`);
    const output = path.join(__dirname, '..', `webp-${id}.webp`);

    try {
      const buffer = await download(image);
      fs.writeFileSync(input, buffer);

      await run('ffmpeg', [
        '-y',
        '-i', input,
        '-c:v', 'libwebp',
        '-quality', '80',
        output
      ]);

      await sock.sendMessage(sender, {
        document: fs.readFileSync(output),
        mimetype: 'image/webp',
        fileName: 'image.webp'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ WebP conversion failed.\n\nMake sure FFmpeg is installed.\n\n${error.message}`
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
