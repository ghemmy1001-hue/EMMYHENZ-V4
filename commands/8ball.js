module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball',

  async execute(sock, sender, args) {
    const question = args.join(' ').trim();

    if (!question) {
      return sock.sendMessage(sender, {
        text: '🎱 Ask a question.\nExample: .8ball Will I pass my exam?'
      });
    }

    const answers = [
      'Yes ✅',
      'No ❌',
      'Maybe 🤔',
      'Definitely! 🔥',
      'Not sure yet 👀',
      'Ask again later ⏳',
      'Absolutely 💯',
      'Very unlikely 😅'
    ];

    const answer =
      answers[Math.floor(Math.random() * answers.length)];

    await sock.sendMessage(sender, {
      text:
        `🎱 *MAGIC 8-BALL*\n\n` +
        `Question: ${question}\n\n` +
        `Answer: *${answer}*`
    });
  }
};
