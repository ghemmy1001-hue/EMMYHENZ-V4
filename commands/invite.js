module.exports = {
  name: 'invite',
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
          `🔗 *GROUP INVITE LINK*\n\n` +
          `https://chat.whatsapp.com/${code}`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not get the invite link.\n${error.message}`
      });
    }
  }
};
