module.exports = {
  name: 'anagram',
  description: 'Shuffle the letters of a word',
  async execute(sock, sender, args) {
    const word = args.join('').trim();

    if (!word) {
      return sock.sendMessage(sender, {
        text: '🔤 Usage: .anagram <word>'
      });
    }

    const shuffled =
      word
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

    await sock.sendMessage(sender, {
      text:
`🔤 *ANAGRAM*

Original: ${word}
Shuffled: *${shuffled}*`
    });
  }
};
