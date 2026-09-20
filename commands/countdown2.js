module.exports = {
  name: 'countdown2',
  description: 'Start a simple countdown',

  async execute(sock, sender, args) {
    const seconds = parseInt(args[0], 10);

    if (
      !Number.isInteger(seconds) ||
      seconds < 1 ||
      seconds > 60
    ) {
      return sock.sendMessage(sender, {
        text:
          '⏳ Usage: .countdown2 <1-60>\n\nExample: .countdown2 10'
      });
    }

    await sock.sendMessage(sender, {
      text: `⏳ Countdown started: *${seconds}s*`
    });

    let remaining = seconds;

    const timer = setInterval(async () => {
      remaining--;

      if (remaining <= 0) {
        clearInterval(timer);

        await sock.sendMessage(sender, {
          text: '🎉 *TIME UP!*'
        });

        return;
      }

      if (
        remaining <= 5 ||
        remaining % 5 === 0
      ) {
        await sock.sendMessage(sender, {
          text: `⏳ *${remaining}* second(s) remaining...`
        });
      }
    }, 1000);
  }
};
