const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getSticker(msg) {
  return (
    msg.message?.stickerMessage ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ||
    null
  );
}

function download(sticker) {
  return (async () => {
    const stream = await downloadContentFromMessage(
      sticker,
      'sticker'
    );

    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  })();
}

module.exports = {
  name: 'tovid',
  description: 'Convert animated sticker to video',

  async execute(sock, sender, args, msg) {
    const sticker = getSticker(msg);

    if (!sticker) {
      return sock.sendMessage(sender, {
        text: '🎥 Reply to an animated sticker with .tovid'
      });
    }

    if (!sticker.isAnimated) {
      return sock.sendMessage(sender, {
        text: '⚠️ That sticker does not appear to be animated.'
      });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const input = path.join(os.tmpdir(), `${id}.webp`);
    const output = path.join(os.tmpdir(), `${id}.mp4`);

    try {
      fs.writeFileSync(input, await download(sticker));

      execFile(
        'ffmpeg',
        [
          '-y',
          '-i', input,
          '-movflags', 'faststart',
          '-pix_fmt', 'yuv420p',
          output
        ],
        async error => {
          try {
            if (error) {
              throw error;
            }

            await sock.sendMessage(sender, {
              video: fs.readFileSync(output),
              caption: '🎥 Converted animated sticker'
            });
          } catch (err) {
            await sock.sendMessage(sender, {
              text: `❌ Video conversion failed.\n\n${err.message}`
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
      try {
        fs.unlinkSync(input);
      } catch {}

      await sock.sendMessage(sender, {
        text: `❌ Could not process sticker.\n\n${error.message}`
      });
    }
  }
};
