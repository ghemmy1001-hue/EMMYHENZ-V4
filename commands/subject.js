module.exports = {
  name: 'subject',
  description: 'Show group name',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    await sock.sendMessage(sender, {
      text: `🏷️ *GROUP NAME*\n\n${metadata.subject}`
    });
  }
};
