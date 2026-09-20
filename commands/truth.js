const questions = [
  'What is one skill you really want to learn?',
  'What is your favorite game?',
  'What is something that always makes you laugh?',
  'What is your favorite school subject?',
  'What is one goal you want to achieve?',
  'What is your favorite movie?',
  'What is something you are proud of?'
];

module.exports = {
  name: 'truth',
  description: 'Get a truth question',

  async execute(sock, sender) {
    const question =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text:
        `🟢 *TRUTH*\n\n${question}`
    });
  }
};
