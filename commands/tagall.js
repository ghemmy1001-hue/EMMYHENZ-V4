const g = require('../utils/group');

module.exports = {
  name: 'tagall',
  description: 'Mention all group members',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const text = args.join(' ') || '📢 Attention everyone!';

      const mentions = metadata.participants.map(p => p.id);

      await sock.sendMessage(sender, {
        text: text,
        mentions: mentions
      });

    } catch (error) {
      console.error('Tagall error:', error);

      await sock.sendMessage(sender, {
        text: '❌ Failed to tag group members.'
      });
    }
  }
};
