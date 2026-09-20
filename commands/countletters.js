module.exports = {
  name: 'countletters',
  description: 'Count letters in text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🔤 Usage: .countletters your text'
      });
    }

    const letters =
      (text.match(/[A-Za-z]/g) || []).length;

    await sock.sendMessage(sender, {
      text:
`🔤 *LETTER COUNTER*

📝 Text:
${text}

📊 Letters: *${letters}*`
    });
  }
};
