module.exports = {
  name: 'wyr',
  description: 'Would you rather question',

  async execute(sock, sender) {
    const questions = [
      '🎮 Would you rather be a pro gamer or a famous developer?',
      '🌍 Would you rather travel the world or build your dream house?',
      '💻 Would you rather master coding or AI?',
      '🏆 Would you rather win a major tournament or create a successful app?',
      '📚 Would you rather read every book or watch every movie?'
    ];

    const q =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text: `🤔 *WOULD YOU RATHER?*\n\n${q}`
    });
  }
};
