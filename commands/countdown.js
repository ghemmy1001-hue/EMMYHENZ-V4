module.exports = {
  name: 'countdown',
  description: 'Start a countdown',
  async execute(sock, sender, args) {
    const seconds = Number(args[0]);

    if (!Number.isInteger(seconds) || seconds < 1 || seconds > 60) {
      return sock.sendMessage(sender, {
        text: '⏳ Usage: .countdown <1-60>'
      });
    }

    await sock.sendMessage(sender, {
      text: `⏳ Countdown started: *${seconds}s*`
    });

    setTimeout(async () => {
      await sock.sendMessage(sender, {
        text: '🚀 *TIME UP!*'
      });
    }, seconds * 1000);
  }
};
