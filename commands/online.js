const g = require('../utils/group');

module.exports = {
  name: 'online',
  description: 'Show available presence information',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      await sock.sendMessage(sender, {
        text:
          `🟢 *ONLINE STATUS*\n\n` +
          `👥 Group members: *${metadata.participants.length}*\n\n` +
          `WhatsApp does not provide DEV-X with a guaranteed complete live-online list for every group member.`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: '❌ Could not retrieve group information.'
      });
    }
  }
};
