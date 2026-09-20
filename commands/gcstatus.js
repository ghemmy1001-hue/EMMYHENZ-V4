const g = require('../utils/group');

module.exports = {
  name: 'gcstatus',
  description: 'Show group status',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const admins = metadata.participants.filter(
        p => p.admin === 'admin' || p.admin === 'superadmin'
      ).length;

      await sock.sendMessage(sender, {
        text:
          `📊 *GROUP STATUS*\n\n` +
          `👥 Members: *${metadata.participants.length}*\n` +
          `👑 Admins: *${admins}*\n` +
          `🔐 Restriction: *${metadata.announce ? 'Admins only' : 'Everyone'}*\n` +
          `✏️ Edit info: *${metadata.restrict ? 'Admins only' : 'Everyone'}*`
      });
    } catch (error) {
      console.log('gcstatus error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Could not retrieve group status.'
      });
    }
  }
}
