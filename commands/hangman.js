const games = new Map();

const words = [
  'javascript',
  'whatsapp',
  'computer',
  'internet',
  'developer',
  'football',
  'science',
  'galaxy'
];

module.exports = {
  name: 'hangman',
  description: 'Play Hangman',

  async execute(sock, sender, args) {
    let game = games.get(sender);

    if (!game || args[0] === 'new') {
      const word =
        words[Math.floor(Math.random() * words.length)];

      game = {
        word,
        guessed: [],
        attempts: 6
      };

      games.set(sender, game);
    }

    if (args[0] === 'stop') {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text: '🛑 Hangman stopped.'
      });
    }

    const guess = args[0]?.toLowerCase();

    if (guess) {
      if (!/^[a-z]$/.test(guess)) {
        return sock.sendMessage(sender, {
          text: '❌ Guess one letter at a time.'
        });
      }

      if (game.guessed.includes(guess)) {
        return sock.sendMessage(sender, {
          text: '⚠️ You already guessed that letter.'
        });
      }

      game.guessed.push(guess);

      if (!game.word.includes(guess)) {
        game.attempts--;
      }
    }

    const display = [...game.word]
      .map(letter =>
        game.guessed.includes(letter) ? letter : '_'
      )
      .join(' ');

    if (!display.includes('_')) {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text:
          `🎉 *YOU WON!*\n\n` +
          `Word: *${game.word}*`
      });
    }

    if (game.attempts <= 0) {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text:
          `💀 *GAME OVER*\n\n` +
          `The word was: *${game.word}*`
      });
    }

    await sock.sendMessage(sender, {
      text:
        `🎮 *HANGMAN*\n\n` +
        `${display}\n\n` +
        `❤️ Attempts: *${game.attempts}*\n` +
        `🔤 Guessed: ${game.guessed.join(', ') || 'none'}\n\n` +
        `Guess with:\n` +
        `.hangman a`
    });
  }
};
