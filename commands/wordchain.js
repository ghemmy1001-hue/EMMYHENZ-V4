module.exports = {
  name: 'wordchain',
  description: 'Play a word-chain game',
  async execute(sock, sender, args) {
    const word = args[0]?.toLowerCase();

    if (!word) {
      return sock.sendMessage(sender, {
        text: '🔤 Use `.wordchain <word>`'
      });
    }

    const last = word[word.length - 1];

    await sock.sendMessage(sender, {
      text:
`🔗 *WORD CHAIN*

Your word: *${word}*
Last letter: *${last.toUpperCase()}*

🤖 Now send another word starting with *${last.toUpperCase()}*.`
    });
  }
};
