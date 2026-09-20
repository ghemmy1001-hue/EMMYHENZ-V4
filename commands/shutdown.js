module.exports = {
  name: 'shutdown',
  description: 'Stop the bot process',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: '🛑 Shutting down bot...'
    });

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};
