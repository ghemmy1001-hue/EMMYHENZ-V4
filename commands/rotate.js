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
  name: 'rotate',
  description: 'Rotate a quoted image or video',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const image = quoted?.imageMessage;

    if (!image) {
      return sock.sendMessage(sender, {
        text: '🖼️ Reply to an image with .rotate 90'
      });
    }

    const angle = Number(args[0] || 90);

    const filters = {
      90: 'transpose=1',
      180: 'transpose=1,transpose=1',
      270: 'transpose=2'
    };

    if (!filters[angle]) {
      return sock.sendMessage(sender, {
        text: '❌ Use 90, 180, or 270 degrees.'
      });
    }

    const id = Date.now();

    const input =
      path.join(__dirname, '..', `rotate-input-${id}.jpg`);

    const output =
      path.join(__dirname, '..', `rotate-output-${id}.jpg`);

    try {
      const buffer = await download(image, 'image');

      fs.writeFileSync(input, buffer);

      await run('ffmpeg', [
        '-y',
        '-i', input,
        '-vf', filters[angle],
        output
      ]);

      await sock.sendMessage(sender, {
        image: fs.readFileSync(output),
        caption: `🔄 Rotated ${angle}° successfully.`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Rotation failed:\n${error.message}`
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
