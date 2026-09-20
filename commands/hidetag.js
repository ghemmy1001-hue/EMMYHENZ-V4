const g = require('../utils/group');

module.exports = {
  name: 'hidetag',
  description: 'Mention everyone',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const text = args.join(' ') || '📢 Attention everyone!';

      const mentions = metadata.participants.map(p => p.id);

      await sock.sendMessage(sender, {
        text,
        mentions
      });

    } catch (error) {
      console.error('Hidetag error:', error);

      await sock.sendMessage(sender, {
        text: '❌ Failed to mention members.'
      });
    }
  }
};
