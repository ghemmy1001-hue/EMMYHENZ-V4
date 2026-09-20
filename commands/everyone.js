module.exports = {
  name: 'everyone',
  description: 'Mention everyone in a group',
  async execute(sock, sender, args, msg) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);
    const members = metadata.participants || [];

    const text = args.length
      ? args.join(' ')
      : '📢 Attention everyone!';

    await sock.sendMessage(sender, {
      text,
      mentions: members.map(member => member.id)
    });
  }
};
