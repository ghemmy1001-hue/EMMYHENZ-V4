module.exports = {
  name: 'echo',
  description: 'Repeat text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .echo Hello Emmy'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔊 *ECHO*\n\n${text}`
    });
  }
};
