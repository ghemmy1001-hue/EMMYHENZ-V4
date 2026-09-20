module.exports = {
  name: 'truth2',
  description: 'Random truth question',

  async execute(sock, sender) {
    const questions = [
      'What is one goal you really want to achieve?',
      'What is your favorite subject?',
      'What is something you are proud of?',
      'What is one skill you want to master?',
      'What is your favorite game?'
    ];

    const q =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text: `🗣️ *TRUTH*\n\n${q}`
    });
  }
};
