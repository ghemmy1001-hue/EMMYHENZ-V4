module.exports = {
  name: 'words',
  description: 'Count words in text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .words Hello world from Emmy'
      });
    }

    const count = text.split(/\s+/).filter(Boolean).length;

    await sock.sendMessage(sender, {
      text:
        `📝 *WORD COUNTER*\n\n` +
        `Words: *${count}*\n` +
        `Characters: *${text.length}*`
    });
  }
};
