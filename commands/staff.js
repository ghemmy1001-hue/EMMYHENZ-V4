const g = require('../utils/group');

module.exports = {
  name: 'staff',
  description: 'List group admins',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const admins = metadata.participants.filter(p => p.admin);

      if (!admins.length) {
        return sock.sendMessage(sender, {
          text: '❌ No admins found.'
        });
      }

      const lines = admins.map((p, i) => {
        return `${i + 1}. @${p.id.split('@')[0]}`;
      });

      const mentions = admins.map(p => p.id);

      await sock.sendMessage(sender, {
        text: '👑 *GROUP ADMINS*\\n\\n' + lines.join('\\n'),
        mentions
      });

    } catch (error) {
      console.error('Staff error:', error);

      await sock.sendMessage(sender, {
        text: '❌ Failed to get group admins.'
      });
    }
  }
};
