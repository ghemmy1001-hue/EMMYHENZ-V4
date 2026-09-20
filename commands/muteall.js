module.exports = {
  name: 'muteall',
  description: 'Restrict the group to admins',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      await sock.groupSettingUpdate(
        sender,
        'announcement'
      );

      await sock.sendMessage(sender, {
        text: '🔇 Group muted. Only admins can send messages.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
