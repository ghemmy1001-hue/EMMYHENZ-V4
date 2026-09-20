module.exports = {
  name: 'timezone',
  description: 'Show current time in a timezone',
  async execute(sock, sender, args) {
    const zone = args.join('_') || 'Africa/Lagos';

    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        dateStyle: 'full',
        timeStyle: 'long'
      }).format(now);

      await sock.sendMessage(sender, {
        text: `🌍 Timezone: ${zone}\n🕒 ${formatted}`
      });
    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Invalid timezone.\n\nExample: .timezone Africa/Lagos'
      });
    }
  }
};
