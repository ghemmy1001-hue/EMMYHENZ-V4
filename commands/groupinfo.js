const g = require('../utils/group');

module.exports = {
  name: 'groupinfo',
  description: 'Show group information',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const admins = metadata.participants.filter(p => p.admin);

      const text =
`╔══════════════════════╗
       👥 GROUP INFO
╚══════════════════════╝

📛 Name: ${metadata.subject}
👤 Members: ${metadata.participants.length}
👑 Admins: ${admins.length}
🆔 JID: ${sender}

📝 Description:
${metadata.desc || 'No description'}`;

      await sock.sendMessage(sender, {
        text
      });

    } catch (error) {
      console.error('Groupinfo error:', error);

      await sock.sendMessage(sender, {
        text: '❌ Failed to get group information.'
      });
    }
  }
};
