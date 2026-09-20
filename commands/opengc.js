module.exports = {
  name: 'opengc',
  description: 'Open the group for everyone',

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
        text: '🔓 Group opened. Everyone can send messages.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
