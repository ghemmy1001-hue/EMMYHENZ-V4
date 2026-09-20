module.exports = {
  name: 'groupinfo2',
  description: 'Show detailed group information',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);

      const admins = metadata.participants
        .filter(p => p.admin)
        .length;

      const members = metadata.participants.length;

      const owner =
        metadata.owner ||
        'Unknown';

      const creation =
        metadata.creation
          ? new Date(metadata.creation * 1000)
              .toLocaleString()
          : 'Unknown';

      await sock.sendMessage(sender, {
        text:
`╭━━━〔 👥 GROUP INFO 〕━━━╮
┃
┃ 🏷️ Name: ${metadata.subject || 'Unknown'}
┃ 🆔 ID: ${sender}
┃ 👥 Members: ${members}
┃ 👑 Admins: ${admins}
┃ 📅 Created: ${creation}
┃ 👤 Owner: ${owner}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
