const g = require('../utils/group');

module.exports = {
  name: 'ship',
  description: 'Generate a fun compatibility percentage',

  async execute(sock, sender, args, msg) {
    const mentions =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    let names = mentions.slice(0, 2);

    if (names.length < 2 && args.length >= 2) {
      names = args.slice(0, 2).map(
        n => `${n.replace(/\D/g, '')}@s.whatsapp.net`
      );
    }

    if (names.length < 2) {
      return sock.sendMessage(sender, {
        text:
          '💞 Tag two people.\n\n' +
          'Example:\n' +
          '.ship @user1 @user2'
      });
    }

    const percentage =
      Math.floor(Math.random() * 101);

    await sock.sendMessage(sender, {
      text:
        `💞 *SHIP METER*\n\n` +
        `@${names[0].split('@')[0]} ❤️ @${names[1].split('@')[0]}\n\n` +
        `Compatibility: *${percentage}%*`,
      mentions: names
    });
  }
};
