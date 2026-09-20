module.exports = {
  name: 'admins',
  description: 'List group administrators',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    const admins = metadata.participants.filter(
      p => p.admin === 'admin' || p.admin === 'superadmin'
    );

    if (!admins.length) {
      return sock.sendMessage(sender, {
        text: '❌ No administrators found.'
      });
    }

    const mentions = admins.map(p => p.id);

    const list = admins
      .map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`)
      .join('\n');

    await sock.sendMessage(sender, {
      text:
        `👑 *GROUP ADMINS*\n\n` +
        `${list}`,
      mentions
    });
  }
};
