module.exports = {
  name: '2048',
  description: 'Start a 2048 game',
  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: '🎮 *2048*\n\nUse .2048 to start!\n\n🧩 Game engine coming next.'
    });
  }
};
