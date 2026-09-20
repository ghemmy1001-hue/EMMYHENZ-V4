module.exports = {
  name: 'creator',
  description: 'Show the group creator',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command can only be used in a group.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    const creator = metadata.owner;

    if (!creator) {
      return sock.sendMessage(sender, {
        text: 'ℹ️ Group creator information is unavailable.'
      });
    }

    await sock.sendMessage(sender, {
      text:
        `👑 *GROUP CREATOR*\n\n` +
        `@${creator.split('@')[0]}`,
      mentions: [creator]
    });
  }
};
