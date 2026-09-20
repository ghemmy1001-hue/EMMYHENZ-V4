const g = require('../utils/group');

module.exports = {
  name: 'unlockgroup',
  description: 'Allow everyone to send messages',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupSettingUpdate(sender, 'not_announcement');

      await sock.sendMessage(sender, {
        text: '🔓 Group unlocked.\nEveryone can send messages.'
      });
    } catch (error) {
      console.error('Unlock error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to unlock the group.'
      });
    }
  }
};
