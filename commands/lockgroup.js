const g = require('../utils/group');

module.exports = {
  name: 'lockgroup',
  description: 'Allow only admins to send messages',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupSettingUpdate(sender, 'announcement');

      await sock.sendMessage(sender, {
        text: '🔒 Group locked.\nOnly admins can send messages.'
      });
    } catch (error) {
      console.error('Lock error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to lock the group.'
      });
    }
  }
};
