const g = require('../utils/group');

module.exports = {
  name: 'tagall2',
  description: 'Tag all group members',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await sock.groupMetadata(sender);

    const participants = metadata.participants || [];

    const mentions = participants.map(p => p.id);

    const text =
      args.join(' ').trim() ||
      '📢 Attention everyone!';

    await sock.sendMessage(sender, {
      text,
      mentions
    });
  }
};
