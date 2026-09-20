const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getMedia(msg) {
  const m = msg.message;

  if (m?.imageMessage) return { type: 'image', data: m.imageMessage };
  if (m?.videoMessage) return { type: 'video', data: m.videoMessage };

  const q = m?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (q?.imageMessage) return { type: 'image', data: q.imageMessage };
  if (q?.videoMessage) return { type: 'video', data: q.videoMessage };

  return null;
}

async function download(media) {
  const stream = await downloadContentFromMessage(
    media.data,
    media.type
  );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'compress',
  description: 'Compress an image or video',

  async execute(sock, sender, args, msg) {
    const media = getMedia(msg);

    if (!media) {
      return sock.sendMessage(sender, {
        text: '📦 Reply to an image or video with .compress'
      });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const input = path.join(os.tmpdir(), `${id}_input`);
    const output = path.join(os.tmpdir(), `${id}_output`);

    try {
      fs.writeFileSync(input, await download(media));

      const ffArgs =
        media.type === 'video'
          ? [
              '-y',
              '-i', input,
              '-vf', 'scale=-2:720',
              '-c:v', 'libx264',
              '-crf', '30',
              '-preset', 'veryfast',
              '-c:a', 'aac',
              output
            ]
          : [
              '-y',
              '-i', input,
              '-q:v', '7',
              output
            ];

      execFile(
        'ffmpeg',
        ffArgs,
        async error => {
          try {
            if (error) throw error;

            if (media.type === 'video') {
              await sock.sendMessage(sender, {
                video: fs.readFileSync(output),
                caption: '📦 Video compressed.'
              });
            } else {
              await sock.sendMessage(sender, {
                image: fs.readFileSync(output),
                caption: '📦 Image compressed.'
              });
            }
          } catch (err) {
            await sock.sendMessage(sender, {
              text: `❌ Compression failed.\n\n${err.message}`
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
        text: `❌ Could not process media.\n\n${error.message}`
      });
    }
  }
};
