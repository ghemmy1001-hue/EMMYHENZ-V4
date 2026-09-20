const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getImage(msg) {
  const m = msg.message;

  if (m?.imageMessage) return m.imageMessage;

  return m?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || null;
}

async function download(image) {
  const stream = await downloadContentFromMessage(
    image,
    'image'
  );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'blur',
  description: 'Blur an image',

  async execute(sock, sender, args, msg) {
    const image = getImage(msg);

    if (!image) {
      return sock.sendMessage(sender, {
        text: '🌫️ Reply to an image with .blur'
      });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const input = path.join(os.tmpdir(), `${id}_input`);
    const output = path.join(os.tmpdir(), `${id}.jpg`);

    try {
      fs.writeFileSync(input, await download(image));

      execFile(
        'ffmpeg',
        [
          '-y',
          '-i', input,
          '-vf', 'boxblur=8:2',
          '-q:v', '3',
          output
        ],
        async error => {
          try {
            if (error) throw error;

            await sock.sendMessage(sender, {
              image: fs.readFileSync(output),
              caption: '🌫️ Image blurred.'
            });
          } catch (err) {
            await sock.sendMessage(sender, {
              text: `❌ Blur failed.\n\n${err.message}`
            });
          } finally {
            for (const file of [input, output]) {
              try {
                fs.unlinkSync(file);
              } catch {}
            }
          }
        }
      );

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not process image.\n\n${error.message}`
      });
    }
  }
};
