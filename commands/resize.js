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
  name: 'resize',
  description: 'Resize an image',

  async execute(sock, sender, args, msg) {
    const image = getImage(msg);

    if (!image) {
      return sock.sendMessage(sender, {
        text: '📐 Reply to an image.\n\nExample: .resize 800'
      });
    }

    const width = Number(args[0]);

    if (!Number.isInteger(width) || width < 50 || width > 3000) {
      return sock.sendMessage(sender, {
        text: '❌ Width must be between 50 and 3000 pixels.'
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
          '-vf', `scale=${width}:-2`,
          '-q:v', '3',
          output
        ],
        async error => {
          try {
            if (error) throw error;

            await sock.sendMessage(sender, {
              image: fs.readFileSync(output),
              caption: `📐 Resized to ${width}px wide.`
            });
          } catch (err) {
            await sock.sendMessage(sender, {
              text: `❌ Resize failed.\n\n${err.message}`
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
