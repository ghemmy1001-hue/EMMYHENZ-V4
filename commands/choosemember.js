const g = require('../utils/group');

module.exports = {
  name: 'choosemember',
  description: 'Randomly choose one of the mentioned members',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const context =
        msg?.message?.extendedTextMessage?.contextInfo ||
        msg?.message?.imageMessage?.contextInfo ||
        msg?.message?.videoMessage?.contextInfo ||
        {};

      const mentioned =
        context.mentionedJid || [];

      if (mentioned.length < 2) {
        return sock.sendMessage(sender, {
          text:
`🎯 *CHOOSE MEMBER*

Mention at least 2 members.

Example:
.choosemember @user1 @user2`
        });
      }

      const target =
        mentioned[
          Math.floor(
            Math.random() * mentioned.length
          )
        ];

      await sock.sendMessage(sender, {
        text:
`🎯 *MEMBER CHOICE*

After the random selection...

🏆 The chosen member is:

👤 @${target.split('@')[0]} 🎉`,

        mentions: [target]
      });

    } catch (error) {
      console.log('❌ choosemember error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to choose a member.'
      });
    }
  }
};
