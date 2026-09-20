const g = require('../utils/group');

module.exports = {
  name: 'onlinestats',
  description: 'Show group statistics',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const admins = metadata.participants.filter(
        p => p.admin === 'admin' || p.admin === 'superadmin'
      );

      const regular = metadata.participants.length - admins.length;

      await sock.sendMessage(sender, {
        text:
          `📈 *GROUP STATS*\n\n` +
          `👥 Total members: *${metadata.participants.length}*\n` +
          `👑 Administrators: *${admins.length}*\n` +
          `👤 Regular members: *${regular}*\n\n` +
          `ℹ️ Live presence data is not guaranteed for every member.`
      });
    } catch (error) {
      console.log('onlinestats error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to retrieve statistics.'
      });
    }
  }
};
