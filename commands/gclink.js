const g = require('../utils/group');

module.exports = {
  name: 'gclink',
  description: 'Get group invite link',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const code = await sock.groupInviteCode(sender);

      await sock.sendMessage(sender, {
        text:
          `🔗 *GROUP INVITE LINK*\n\n` +
          `https://chat.whatsapp.com/${code}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not get group link.\n${error.message}`
      });
    }
  }
};
