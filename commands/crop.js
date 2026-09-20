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

async function download(media) {
  const stream = await downloadContentFromMessage(media, 'image');
  const chunks = [];

  for await (const chunk of stream) chunks.push(chunk);

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'crop',
  description: 'Crop a quoted image',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const image = quoted?.imageMessage;

    if (!image) {
      return sock.sendMessage(sender, {
        text: '🖼️ Reply to an image with .crop'
      });
    }

    const id = Date.now();
    const input = path.join(__dirname, '..', `crop-${id}.jpg`);
    const output = path.join(__dirname, '..', `crop-${id}.jpg`);

    try {
      const buffer = await download(image);

      const tempInput =
        path.join(__dirname, '..', `crop-input-${id}.jpg`);

      fs.writeFileSync(tempInput, buffer);

      await run('ffmpeg', [
        '-y',
        '-i', tempInput,
        '-vf', 'crop=min(iw\\,ih):min(iw\\,ih)',
        output
      ]);

      await sock.sendMessage(sender, {
        image: fs.readFileSync(output),
        caption: '✂️ Image cropped successfully.'
      });

      fs.unlinkSync(tempInput);
      fs.unlinkSync(output);

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Crop failed:\n${error.message}`
      });

      for (const file of [
        input,
        output,
        path.join(__dirname, '..', `crop-input-${id}.jpg`)
      ]) {
        try {
          if (fs.existsSync(file)) fs.unlinkSync(file);
        } catch {}
      }
    }
  }
};
