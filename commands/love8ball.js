module.exports = {
  name: 'love8ball',
  description: 'Ask the love 8-ball',
  async execute(sock, sender, args) {
    if (!args.length) {
      return sock.sendMessage(sender, {
        text: '🎱 Ask a love question.\n\nExample: .love8ball Will I find love?'
      });
    }

    const answers = [
      '💖 Definitely!',
      '❤️ The signs look good.',
      '👀 Maybe…',
      '😂 Ask again later.',
      '🤔 It is uncertain.',
      '💔 Probably not.',
      '✨ There is a chance!',
      '🥶 Only time will tell.'
    ];

    const answer =
      answers[Math.floor(Math.random() * answers.length)];

    await sock.sendMessage(sender, {
      text:
`🎱 *LOVE 8-BALL*

❓ ${args.join(' ')}

🔮 ${answer}`
    });
  }
};
