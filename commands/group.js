module.exports = {
  name: 'group',
  description: 'Show basic group information',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command can only be used in a group.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    const admins = metadata.participants.filter(
      p => p.admin === 'admin' || p.admin === 'superadmin'
    ).length;

    await sock.sendMessage(sender, {
      text:
        `╔══════════════════════╗\n` +
        `║ 👥 *GROUP INFORMATION*\n` +
        `╠══════════════════════╣\n` +
        `║ 🏷️ Name: *${metadata.subject}*\n` +
        `║ 👤 Members: *${metadata.participants.length}*\n` +
        `║ 👑 Admins: *${admins}*\n` +
        `║ 🆔 ID: \`${sender}\`\n` +
        `╚══════════════════════╝`
    });
  }
};
