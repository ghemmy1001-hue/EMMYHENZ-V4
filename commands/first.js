const g = require('../utils/group');

module.exports = {
  name: 'first',
  description: 'Show information about the first listed group participant',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await sock.groupMetadata(sender);
      const participants = metadata.participants || [];

      if (!participants.length) {
        return sock.sendMessage(sender, {
          text: '❌ No participants found.'
        });
      }

      const target =
        participants[0].id ||
        participants[0].jid;

      if (!target) {
        return sock.sendMessage(sender, {
          text: '❌ Could not identify the participant.'
        });
      }

      await sock.sendMessage(sender, {
        text:
`👤 *FIRST LISTED MEMBER*

📱 @${target.split('@')[0]}`,

        mentions: [target]
      });

    } catch (error) {
      console.log('❌ first error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to get participant information.'
      });
    }
  }
};
