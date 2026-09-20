const answers = [
  '🎱 Absolutely!',
  '🎱 Definitely yes.',
  '🎱 Most likely.',
  '🎱 Ask again later.',
  '🎱 Maybe.',
  '🎱 Probably not.',
  '🎱 I would not count on it.',
  '🎱 Definitely not.'
];

module.exports = {
  name: '8ball2',
  description: 'Ask the Magic 8-Ball a question',

  async execute(sock, sender, args) {
    const question = args.join(' ').trim();

    if (!question) {
      return sock.sendMessage(sender, {
        text: '🎱 Usage: .8ball2 <question>'
      });
    }

    const answer =
      answers[Math.floor(Math.random() * answers.length)];

    await sock.sendMessage(sender, {
      text:
`🎱 *MAGIC 8-BALL*

❓ ${question}

${answer}`
    });
  }
};
