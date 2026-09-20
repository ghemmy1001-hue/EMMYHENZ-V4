const g = require('../utils/group');

async function getImageMessage(msg) {
  if (msg.message?.imageMessage) {
    return msg.message.imageMessage;
  }

  const quoted =
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (quoted?.imageMessage) {
    return quoted.imageMessage;
  }

  return null;
}

module.exports = {
  name: 'setpp',
  description: 'Change bot profile picture',

  async execute(sock, sender, args, msg) {
    try {
      const image = await getImageMessage(msg);

      if (!image) {
        return sock.sendMessage(sender, {
          text:
            '🖼️ *SETPP*\n\n' +
            'Send or reply to an image with:\n' +
            '.setpp'
        });
      }

      const stream =
        await require('@whiskeysockets/baileys')
          .downloadContentFromMessage(image, 'image');

      const chunks = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      const botJid =
        sock.user?.id?.split(':')[0] +
        '@s.whatsapp.net';

      await sock.updateProfilePicture(
        botJid,
        buffer
      );

      await sock.sendMessage(sender, {
        text: '✅ Bot profile picture updated successfully.'
      });

    } catch (error) {
      console.log(
        '❌ SETPP error:',
        error.message
      );

      await sock.sendMessage(sender, {
        text:
          `❌ Failed to update profile picture.\n\n` +
          `Reason: ${error.message}`
      });
    }
  }
};
