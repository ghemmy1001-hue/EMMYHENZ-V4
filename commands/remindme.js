module.exports = {
  name: 'remindme',
  description: 'Set a simple reminder',
  async execute(sock, sender, args) {
    const seconds = Number(args[0]);
    const message = args.slice(1).join(' ');

    if (
      !Number.isFinite(seconds) ||
      seconds <= 0 ||
      !message
    ) {
      return sock.sendMessage(sender, {
        text: '⏰ Usage: .remindme <seconds> <message>'
      });
    }

    await sock.sendMessage(sender, {
      text: `⏰ Reminder set for ${seconds} seconds.`
    });

    setTimeout(async () => {
      await sock.sendMessage(sender, {
        text: `🔔 *REMINDER*\n\n${message}`
      });
    }, seconds * 1000);
  }
};
