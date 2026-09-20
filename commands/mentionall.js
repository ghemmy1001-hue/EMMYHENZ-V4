module.exports = {
  name: 'mentionall',
  description: 'Mention every group member',

  async execute(sock, sender, args) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);
      const members = metadata.participants || [];
      const mentions = members.map(p => p.id);

      const message = args.join(' ').trim() ||
        '📢 Attention everyone!';

      await sock.sendMessage(sender, {
        text: `${message}\n\n${mentions.map(jid =>
          `@${jid.split('@')[0]}`
        ).join(' ')}`,
        mentions
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
