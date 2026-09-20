module.exports = {
  name: 'count',
  description: 'Count characters and words',

  async execute(sock, sender, args) {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .count your text here'
      });
    }

    const characters = text.length;
    const charactersNoSpaces =
      text.replace(/\s/g, '').length;
    const words =
      text.trim().split(/\s+/).length;

    await sock.sendMessage(sender, {
      text:
        `📊 *TEXT COUNT*\n\n` +
        `🔤 Characters: *${characters}*\n` +
        `🔡 Without spaces: *${charactersNoSpaces}*\n` +
        `📝 Words: *${words}*`
    });
  }
};
