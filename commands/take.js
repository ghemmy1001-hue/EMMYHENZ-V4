const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function getSticker(msg) {
  return (
    msg.message?.stickerMessage ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage ||
    null
  );
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
  name: 'take',
  description: 'Copy a sticker with custom pack metadata',

  async execute(sock, sender, args, msg) {
    const sticker = await getSticker(msg);

    if (!sticker) {
      return sock.sendMessage(sender, {
        text: '🎨 Reply to a sticker with .take PackName'
      });
    }

    const pack = args.join(' ').trim() || 'EMMYHENZ-V4';

    try {
      const buffer = await download(sticker);

      await sock.sendMessage(sender, {
        sticker: buffer,
        contextInfo: {
          externalAdReply: {
            title: pack,
            body: 'EMMYHENZ-V4',
            mediaType: 1
          }
        }
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not process sticker.\n\n${error.message}`
      });
    }
  }
};
