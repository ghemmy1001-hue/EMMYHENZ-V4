const g = require('../utils/group');

module.exports = {
  name: 'tagcount',
  description: 'Show the number of members in the group',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await sock.groupMetadata(sender);
      const count = metadata.participants?.length || 0;

      await sock.sendMessage(sender, {
        text:
`👥 *GROUP MEMBER COUNT*

🏷️ ${metadata.subject}

👤 Total members: *${count}*`
      });

    } catch (error) {
      console.log('❌ tagcount error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to count group members.'
      });
    }
  }
};
