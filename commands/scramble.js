module.exports = {
  name: 'scramble',
  description: 'Scramble a word',
  async execute(sock, sender, args) {
    const word = args.join('').toLowerCase();

    if (!word) {
      return sock.sendMessage(sender, {
        text: '🔀 Use `.scramble <word>`'
      });
    }

    const letters = word.split('');

    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] =
        [letters[j], letters[i]];
    }

    await sock.sendMessage(sender, {
      text:
`🔀 *SCRAMBLED WORD*

Original: *${word}*
Scrambled: *${letters.join('')}*`
    });
  }
};
