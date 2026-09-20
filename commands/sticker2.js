const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function getMedia(msg) {
  const m = msg.message;
  if (m?.imageMessage) return { type: 'image', data: m.imageMessage };
  if (m?.videoMessage) return { type: 'video', data: m.videoMessage };

  const q = m?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (q?.imageMessage) return { type: 'image', data: q.imageMessage };
  if (q?.videoMessage) return { type: 'video', data: q.videoMessage };

  return null;
}

async function download(media) {
  const stream = await downloadContentFromMessage(media.data, media.type);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'sticker2',
  description: 'Convert an image or short video to a sticker',

  async execute(sock, sender, args, msg) {
    try {
      const media = await getMedia(msg);

      if (!media) {
        return sock.sendMessage(sender, {
          text: '🖼️ Reply to an image or video with .sticker2'
        });
      }

      const buffer = await download(media);

      await sock.sendMessage(sender, {
        sticker: buffer
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Sticker conversion failed.\n\n${error.message}`
      });
    }
  }
};
