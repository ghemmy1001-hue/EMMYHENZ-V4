const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function download(media) {
  const stream = await downloadContentFromMessage(media, 'video');
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'video',
  description: 'Download a quoted video',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const media = quoted?.videoMessage;

    if (!media) {
      return sock.sendMessage(sender, {
        text: '🎬 Reply to a video with .video'
      });
    }

    try {
      const buffer = await download(media);

      await sock.sendMessage(sender, {
        video: buffer,
        mimetype: media.mimetype || 'video/mp4',
        caption: args.join(' ').trim() || ''
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Video download failed:\n${error.message}`
      });
    }
  }
};
