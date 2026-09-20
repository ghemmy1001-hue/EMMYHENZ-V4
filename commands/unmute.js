const g = require('../utils/group');

module.exports = {
  name: 'unmute',
  description: 'Allow everyone to send messages',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupSettingUpdate(
        sender,
        'not_announcement'
      );

      await sock.sendMessage(sender, {
        text:
          '🔊 *GROUP UNMUTED*\n\n' +
          'Everyone can now send messages.'
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed to unmute group.\n${error.message}`
      });
    }
  }
};
