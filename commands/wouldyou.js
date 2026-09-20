module.exports = {
  name: 'wouldyou',
  description: 'Ask a Would You Rather question',
  async execute(sock, sender) {
    const questions = [
      'Would you rather fly or become invisible?',
      'Would you rather be extremely fast or extremely strong?',
      'Would you rather live by the beach or in the mountains?',
      'Would you rather have unlimited money or unlimited knowledge?',
      'Would you rather travel to the future or the past?'
    ];

    const question =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text: `🤔 WOULD YOU RATHER?\n\n${question}`
    });
  }
};
