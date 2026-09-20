const questions = [
  {
    q: 'What planet is known as the Red Planet?',
    options: 'A) Venus\nB) Mars\nC) Jupiter\nD) Saturn',
    answer: 'b'
  },
  {
    q: 'How many days are in a leap year?',
    options: 'A) 365\nB) 366\nC) 364\nD) 360',
    answer: 'b'
  },
  {
    q: 'What gas do plants mainly use during photosynthesis?',
    options: 'A) Oxygen\nB) Nitrogen\nC) Carbon dioxide\nD) Hydrogen',
    answer: 'c'
  },
  {
    q: 'How many continents are there?',
    options: 'A) 5\nB) 6\nC) 7\nD) 8',
    answer: 'c'
  }
];

const games = new Map();

module.exports = {
  name: 'trivia',
  description: 'Play trivia',

  async execute(sock, sender, args) {
    let game = games.get(sender);

    if (!game || args[0] === 'new') {
      const question =
        questions[Math.floor(Math.random() * questions.length)];

      game = {
        question,
        answered: false
      };

      games.set(sender, game);

      return sock.sendMessage(sender, {
        text:
          `🧠 *TRIVIA*\n\n` +
          `${question.q}\n\n` +
          `${question.options}\n\n` +
          `Answer with:\n` +
          `.trivia a`
      });
    }

    if (game.answered) return;

    const answer = args[0]?.toLowerCase();

    if (!['a', 'b', 'c', 'd'].includes(answer)) {
      return sock.sendMessage(sender, {
        text: '❌ Answer with A, B, C or D.'
      });
    }

    game.answered = true;

    const correct =
      answer === game.question.answer;

    games.delete(sender);

    await sock.sendMessage(sender, {
      text:
        correct
          ? '🎉 *Correct!* You got it right!'
          : `❌ *Wrong!*\n\nCorrect answer: *${game.question.answer.toUpperCase()}*`
    });
  }
};
