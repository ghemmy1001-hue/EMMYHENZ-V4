module.exports = {
  name: 'trivia2',
  description: 'Send a random trivia question',
  async execute(sock, sender) {
    const questions = [
      '🌍 What is the largest continent?\n\nA) Africa\nB) Asia\nC) Europe\nD) Australia',
      '🪐 Which planet is known as the Red Planet?\n\nA) Venus\nB) Mars\nC) Jupiter\nD) Saturn',
      '🧪 What is the chemical symbol for oxygen?\n\nA) O\nB) Ox\nC) C\nD) H',
      '🌊 What is the largest ocean?\n\nA) Atlantic\nB) Indian\nC) Pacific\nD) Arctic'
    ];

    const question =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text: `🧠 *TRIVIA*\n\n${question}`
    });
  }
};
