module.exports = {
  name: 'unmuteall',
  description: 'Allow all members to send messages',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      await sock.groupSettingUpdate(
        sender,
        'not_announcement'
      );

      await sock.sendMessage(sender, {
        text: '🔊 Group unmuted. Everyone can send messages.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
