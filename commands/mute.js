const g = require('../utils/group');

module.exports = {
  name: 'mute',
  description: 'Restrict group messages to admins',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupSettingUpdate(
        sender,
        'announcement'
      );

      await sock.sendMessage(sender, {
        text:
          '🔇 *GROUP MUTED*\n\n' +
          'Only group admins can now send messages.'
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed to mute group.\n${error.message}`
      });
    }
  }
};
