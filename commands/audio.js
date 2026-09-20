const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function download(media, type) {
  const stream = await downloadContentFromMessage(media, type);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'audio',
  description: 'Download a quoted audio message',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const media = quoted?.audioMessage;

    if (!media) {
      return sock.sendMessage(sender, {
        text: '🎵 Reply to an audio message with .audio'
      });
    }

    try {
      const buffer = await download(media, 'audio');

      await sock.sendMessage(sender, {
        audio: buffer,
        mimetype: media.mimetype || 'audio/mpeg',
        fileName: 'audio.mp3'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Audio download failed:\n${error.message}`
      });
    }
  }
};
