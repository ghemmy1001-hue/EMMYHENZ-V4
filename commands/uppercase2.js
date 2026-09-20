module.exports = {
  name: 'uppercase2',
  description: 'Convert text to uppercase',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🔠 Usage: .uppercase2 hello world'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔠 ${text.toUpperCase()}`
    });
  }
};
