const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function getSticker(msg) {
  const m = msg.message;

  if (m?.stickerMessage) {
    return m.stickerMessage;
  }

  return m?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage || null;
}

async function download(sticker) {
  const stream = await downloadContentFromMessage(
    sticker,
    'sticker'
  );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'toimg',
  description: 'Convert a sticker to an image',

  async execute(sock, sender, args, msg) {
    try {
      const sticker = await getSticker(msg);

      if (!sticker) {
        return sock.sendMessage(sender, {
          text: '🖼️ Reply to a sticker with .toimg'
        });
      }

      const buffer = await download(sticker);

      await sock.sendMessage(sender, {
        image: buffer,
        caption: '🖼️ Converted sticker'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Conversion failed.\n\n${error.message}`
      });
    }
  }
};
