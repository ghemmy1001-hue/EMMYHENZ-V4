const timers = new Map();

module.exports = {
  name: 'reminder',
  description: 'Set a reminder',
  async execute(sock, sender, args) {
    const seconds = Number(args[0]);
    const message = args.slice(1).join(' ');

    if (!Number.isFinite(seconds) || seconds <= 0 || !message) {
      return sock.sendMessage(sender, {
        text: '⏰ Usage: .reminder <seconds> <message>'
      });
    }

    if (seconds > 86400) {
      return sock.sendMessage(sender, {
        text: '❌ Maximum reminder time is 24 hours.'
      });
    }

    await sock.sendMessage(sender, {
      text: `⏰ Reminder set for ${seconds} seconds.`
    });

    const timer = setTimeout(async () => {
      timers.delete(sender);

      await sock.sendMessage(sender, {
        text: `🔔 *REMINDER*\n\n${message}`
      });
    }, seconds * 1000);

    timers.set(sender, timer);
  }
};
