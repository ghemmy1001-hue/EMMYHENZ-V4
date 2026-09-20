const questions = [
  'What is your biggest goal right now?',
  'What is something you are afraid of?',
  'Who do you trust the most?',
  'What is one thing you want to change about yourself?',
  'What is your funniest memory?',
  'What is something you have never told your friends?',
  'What is your dream career?'
];

module.exports = {
  name: 'truthme',
  description: 'Get a random truth question',

  async execute(sock, sender) {
    const question =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text:
`🧠 *TRUTH*

❓ ${question}`
    });
  }
};
