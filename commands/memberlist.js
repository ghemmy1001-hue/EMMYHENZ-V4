module.exports = {
  name: 'memberlist',
  description: 'List group members',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    const mentions = metadata.participants.map(p => p.id);

    const list = metadata.participants.map(
      (p, i) => `${i + 1}. @${p.id.split('@')[0]}`
    ).join('\n');

    await sock.sendMessage(sender, {
      text:
        `👥 *MEMBER LIST*\n\n` +
        `${list}`,
      mentions
    });
  }
};
