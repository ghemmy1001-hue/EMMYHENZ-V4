const g = require('../utils/group');

module.exports = {
  name: 'randommember',
  description: 'Choose a random group member',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await sock.groupMetadata(sender);

      const members =
        (metadata.participants || [])
          .map(member =>
            member.id || member.jid
          )
          .filter(Boolean);

      if (!members.length) {
        return sock.sendMessage(sender, {
          text: '❌ No members found.'
        });
      }

      const target =
        members[
          Math.floor(
            Math.random() * members.length
          )
        ];

      await sock.sendMessage(sender, {
        text:
`🎲 *RANDOM MEMBER*

Congratulations 🎉

👤 @${target.split('@')[0]}

You were randomly selected!`,

        mentions: [target]
      });

    } catch (error) {
      console.log('❌ randommember error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to select a random member.'
      });
    }
  }
};
