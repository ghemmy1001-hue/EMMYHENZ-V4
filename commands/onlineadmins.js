const g = require('../utils/group');

module.exports = {
  name: 'onlineadmins',
  description: 'Show group administrators',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const admins = metadata.participants.filter(
        p => p.admin === 'admin' || p.admin === 'superadmin'
      );

      if (!admins.length) {
        return sock.sendMessage(sender, {
          text: '👑 No group administrators found.'
        });
      }

      const mentions = admins.map(p => p.id);

      const list = admins
        .map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`)
        .join('\n');

      await sock.sendMessage(sender, {
        text: `👑 *GROUP ADMINS*\n\n${list}`,
        mentions
      });
    } catch (error) {
      console.log('onlineadmins error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to retrieve administrators.'
      });
    }
  }
};
