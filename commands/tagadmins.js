const g = require('../utils/group');

module.exports = {
  name: 'tagadmins',
  description: 'Mention group admins',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await g.getGroupData(sock, sender);

      const admins = metadata.participants.filter(p => p.admin);
      const mentions = admins.map(p => p.id);

      if (!admins.length) {
        return sock.sendMessage(sender, {
          text: '❌ No admins found.'
        });
      }

      const text = args.join(' ') || '👑 Attention admins!';

      await sock.sendMessage(sender, {
        text,
        mentions
      });

    } catch (error) {
      console.error('Tagadmins error:', error);

      await sock.sendMessage(sender, {
        text: '❌ Failed to tag admins.'
      });
    }
  }
};
