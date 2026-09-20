module.exports = {
  name: 'restart',
  description: 'Restart the bot process',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: '🔄 Restarting bot...'
    });

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};
