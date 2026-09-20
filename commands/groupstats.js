const g = require('../utils/group');

module.exports = {
  name: 'groupstats',
  description: 'Show group information',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata =
        await sock.groupMetadata(sender);

      const admins =
        metadata.participants.filter(
          p => p.admin
        ).length;

      const members =
        metadata.participants.length;

      await sock.sendMessage(sender, {
        text:
`📊 *GROUP STATS*

🏷️ Name: ${metadata.subject}
👥 Members: ${members}
👑 Admins: ${admins}
🆔 ID: ${sender}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Group stats failed.\n${error.message}`
      });
    }
  }
};
