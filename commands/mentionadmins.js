module.exports = {
  name: 'mentionadmins',
  description: 'Mention all group admins',

  async execute(sock, sender, args) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);

      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

      if (!admins.length) {
        return sock.sendMessage(sender, {
          text: 'ℹ️ No admins found.'
        });
      }

      const message = args.join(' ').trim() ||
        '👑 Admin attention please!';

      await sock.sendMessage(sender, {
        text: `${message}\n\n${admins.map(jid =>
          `@${jid.split('@')[0]}`
        ).join(' ')}`,
        mentions: admins
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
