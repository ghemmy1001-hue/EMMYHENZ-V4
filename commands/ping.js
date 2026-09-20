module.exports = {
  name: 'ping',
  description: 'Check if the bot is online',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: '🏓 Pong!\n\n🟢 DEV-X Bot is online!'
    });
  }
};
