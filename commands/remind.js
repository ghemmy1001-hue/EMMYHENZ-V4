module.exports = {
  name: 'remind',
  description: 'Set a reminder',

  async execute(sock, sender, args) {
    const seconds = Number(args.shift());
    const message = args.join(' ').trim();

    if (!Number.isInteger(seconds) || seconds < 1 || seconds > 86400 || !message) {
      return sock.sendMessage(sender, {
        text: '⏰ Example: .remind 60 Study chemistry'
      });
    }

    await sock.sendMessage(sender, {
      text: `⏰ Reminder set for ${seconds} seconds.`
    });

    setTimeout(async () => {
      try {
        await sock.sendMessage(sender, {
          text: `🔔 *REMINDER*\n\n${message}`
        });
      } catch {}
    }, seconds * 1000);
  }
};
