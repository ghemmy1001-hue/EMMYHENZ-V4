const g = require('../utils/group');

module.exports = {
  name: 'tag',
  description: 'Tag everyone in the group',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata =
        await sock.groupMetadata(sender);

      const participants =
        metadata.participants || [];

      const mentions =
        participants
          .map(p => p.id)
          .filter(Boolean);

      const text =
        args.join(' ').trim() ||
        '📢 Attention everyone!';

      await sock.sendMessage(sender, {
        text:
          `${text}\n\n` +
          mentions
            .map(jid => `@${jid.split('@')[0]}`)
            .join(' '),
        mentions
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Tag error:\n${error.message}`
      });
    }
  }
};
