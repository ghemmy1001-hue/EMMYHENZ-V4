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
  const stream = await downloadContentFromMessage(media, 'video');
  const chunks = [];

  for await (const chunk of stream) chunks.push(chunk);

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'reverse2',
  description: 'Reverse a quoted video',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const video = quoted?.videoMessage;

    if (!video) {
      return sock.sendMessage(sender, {
        text: '🔄 Reply to a video with .reverse2'
      });
    }

    const id = Date.now();

    const input =
      path.join(__dirname, '..', `reverse-input-${id}.mp4`);

    const output =
      path.join(__dirname, '..', `reverse-output-${id}.mp4`);

    try {
      const buffer = await download(video);

      fs.writeFileSync(input, buffer);

      await run('ffmpeg', [
        '-y',
        '-i', input,
        '-vf', 'reverse',
        '-an',
        output
      ]);

      await sock.sendMessage(sender, {
        video: fs.readFileSync(output),
        caption: '🔄 Video reversed successfully.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Reverse failed:\n${error.message}`
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
