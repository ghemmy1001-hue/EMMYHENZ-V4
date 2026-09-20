module.exports = {
  name: 'description',
  description: 'Show group description',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    await sock.sendMessage(sender, {
      text:
        `📝 *GROUP DESCRIPTION*\n\n` +
        `${metadata.desc || 'No group description set.'}`
    });
  }
};
