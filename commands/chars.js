module.exports = {
  name: 'chars',
  description: 'Count characters in text',

  async execute(sock, sender, args) {
    const text = args.join(' ');

    if (!text.trim()) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .chars Hello Emmy'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔢 *CHARACTER COUNT*\n\nCharacters: *${text.length}*`
    });
  }
};
