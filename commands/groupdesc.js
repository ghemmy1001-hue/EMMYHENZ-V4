const g = require('../utils/group');

module.exports = {
  name: 'groupdesc',
  description: 'Show the current group description',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await sock.groupMetadata(sender);
      const description =
        metadata.desc ||
        'No group description has been set.';

      await sock.sendMessage(sender, {
        text:
`📋 *GROUP DESCRIPTION*

🏷️ Group: ${metadata.subject}

📝 ${description}`
      });

    } catch (error) {
      console.log('❌ groupdesc error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to get the group description.'
      });
    }
  }
};
