module.exports = {
  name: 'stats',
  description: 'Show group statistics',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    const total = metadata.participants.length;
    const admins = metadata.participants.filter(
      p => p.admin === 'admin' || p.admin === 'superadmin'
    ).length;

    await sock.sendMessage(sender, {
      text:
        `╔══════════════════════╗\n` +
        `║ 📊 *GROUP STATS*\n` +
        `╠══════════════════════╣\n` +
        `║ 🏷️ Name: *${metadata.subject}*\n` +
        `║ 👥 Members: *${total}*\n` +
        `║ 👑 Admins: *${admins}*\n` +
        `╚══════════════════════╝`
    });
  }
};
