module.exports = {
  name: 'adminsinfo',
  description: 'Show group administrators',
  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    const admins = metadata.participants
      .filter(p =>
        p.admin === 'admin' ||
        p.admin === 'superadmin'
      );

    const list = admins.map((p, i) =>
      `${i + 1}. @${p.id.split('@')[0]}`
    ).join('\n');

    await sock.sendMessage(sender, {
      text: `👑 *GROUP ADMINS*\n\n${list || 'No admins found.'}`,
      mentions: admins.map(p => p.id)
    });
  }
};
