module.exports = {
  name: 'time',
  description: 'Show current time',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: `🕐 *CURRENT TIME*\n\n⏰ ${new Date().toLocaleTimeString()}`
    });
  }
};
