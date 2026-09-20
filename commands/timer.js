module.exports = {
  name: 'timer',
  description: 'Start a countdown timer',

  async execute(sock, sender, args) {
    const seconds = Number(args[0]);

    if (!Number.isInteger(seconds) || seconds < 1 || seconds > 3600) {
      return sock.sendMessage(sender, {
        text: '⏱️ Example: .timer 30\n\nMaximum: 3600 seconds.'
      });
    }

    await sock.sendMessage(sender, {
      text: `⏱️ Timer started: *${seconds}s*`
    });

    setTimeout(async () => {
      try {
        await sock.sendMessage(sender, {
          text: '⏰ *TIME IS UP!*'
        });
      } catch {}
    }, seconds * 1000);
  }
};
