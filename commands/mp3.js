const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function downloadMedia(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'mp3',
  description: 'Convert a quoted video/audio file to MP3',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const media = quoted?.videoMessage || quoted?.audioMessage;

    if (!media) {
      return sock.sendMessage(sender, {
        text: '🎵 Reply to a video or audio message with .mp3'
      });
    }

    try {
      const type = media === quoted.videoMessage ? 'video' : 'audio';
      const buffer = await downloadMedia(media, type);

      const file = path.join(
        __dirname,
        '..',
        `temp-${Date.now()}.mp3`
      );

      fs.writeFileSync(file, buffer);

      await sock.sendMessage(sender, {
        audio: fs.readFileSync(file),
        mimetype: 'audio/mpeg',
        fileName: 'audio.mp3'
      });

      fs.unlinkSync(file);

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ MP3 conversion failed:\n${error.message}`
      });
    }
  }
};
