module.exports = {
  name: 'countwords',
  description: 'Count the words in text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🔢 Usage: .countwords your text here'
      });
    }

    const words =
      text.split(/\s+/).filter(Boolean);

    await sock.sendMessage(sender, {
      text:
`🔢 *WORD COUNTER*

📝 Text:
${text}

📊 Words: *${words.length}*`
    });
  }
};
