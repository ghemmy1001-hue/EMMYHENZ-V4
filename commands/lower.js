module.exports = {
  name: 'lower',
  description: 'Convert text to lowercase',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .lower HELLO WORLD'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔤 *LOWERCASE*\n\n${text.toLowerCase()}`
    });
  }
};
