const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getVideo(msg) {
  const m = msg.message;

  if (m?.videoMessage) return m.videoMessage;

  return m?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage || null;
}

async function download(video) {
  const stream = await downloadContentFromMessage(
    video,
    'video'
  );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'tomp4',
  description: 'Convert video to MP4',

  async execute(sock, sender, args, msg) {
    const video = getVideo(msg);

    if (!video) {
      return sock.sendMessage(sender, {
        text: '🎥 Send or reply to a video with .tomp4'
      });
    }

    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const input = path.join(os.tmpdir(), `${id}_input`);
    const output = path.join(os.tmpdir(), `${id}.mp4`);

    try {
      fs.writeFileSync(input, await download(video));

      execFile(
        'ffmpeg',
        [
          '-y',
          '-i', input,
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-movflags', '+faststart',
          output
        ],
        async error => {
          try {
            if (error) throw error;

            await sock.sendMessage(sender, {
              video: fs.readFileSync(output),
              caption: '🎥 MP4 conversion complete.'
            });
          } catch (err) {
            await sock.sendMessage(sender, {
              text: `❌ MP4 conversion failed.\n\n${err.message}`
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
        text: `❌ Could not process video.\n\n${error.message}`
      });
    }
  }
};
