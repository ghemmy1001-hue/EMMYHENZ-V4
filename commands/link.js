module.exports = {
  name: 'link',
  description: 'Get the group invite link',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command can only be used in a group.'
      });
    }

    try {
      const code = await sock.groupInviteCode(sender);

      await sock.sendMessage(sender, {
        text:
          `🔗 *GROUP LINK*\n\n` +
          `https://chat.whatsapp.com/${code}`
      });
    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Unable to retrieve the group link.'
      });
    }
  }
};
