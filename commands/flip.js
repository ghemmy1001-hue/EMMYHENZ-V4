module.exports = {
  name: 'flip',
  description: 'Reverse text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .flip Hello Emmy'
      });
    }

    const reversed = [...text].reverse().join('');

    await sock.sendMessage(sender, {
      text:
        `🔄 *FLIP TEXT*\n\n` +
        `Original: ${text}\n` +
        `Reversed: ${reversed}`
    });
  }
};
