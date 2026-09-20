module.exports = {
  name: 'upper',
  description: 'Convert text to uppercase',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .upper hello world'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔤 *UPPERCASE*\n\n${text.toUpperCase()}`
    });
  }
};
