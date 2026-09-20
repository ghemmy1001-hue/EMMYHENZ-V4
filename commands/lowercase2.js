module.exports = {
  name: 'lowercase2',
  description: 'Convert text to lowercase',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🔡 Usage: .lowercase2 HELLO WORLD'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔡 ${text.toLowerCase()}`
    });
  }
};
