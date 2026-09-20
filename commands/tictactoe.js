const games = new Map();

function board(b) {
  return (
    ` ${b[0]} | ${b[1]} | ${b[2]}\n` +
    `---+---+---\n` +
    ` ${b[3]} | ${b[4]} | ${b[5]}\n` +
    `---+---+---\n` +
    ` ${b[6]} | ${b[7]} | ${b[8]}`
  );
}

function winner(b) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (const [a,c,d] of lines) {
    if (
      b[a] !== ' ' &&
      b[a] === b[c] &&
      b[a] === b[d]
    ) {
      return b[a];
    }
  }

  return b.includes(' ') ? null : 'draw';
}

module.exports = {
  name: 'tictactoe',
  description: 'Play Tic-Tac-Toe',

  async execute(sock, sender, args) {
    const action = (args[0] || '').toLowerCase();

    if (action === 'stop') {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text: '🛑 Tic-Tac-Toe game stopped.'
      });
    }

    let game = games.get(sender);

    if (!game) {
      game = {
        board: [' ',' ',' ',' ',' ',' ',' ',' ',' '],
        turn: 'X'
      };

      games.set(sender, game);

      return sock.sendMessage(sender, {
        text:
          `🎮 *TIC-TAC-TOE*\n\n` +
          `${board(game.board)}\n\n` +
          `You are *X*.\n` +
          `Bot is *O*.\n\n` +
          `Choose a position with:\n` +
          `.tictactoe 1-9`
      });
    }

    const position = Number(args[0]) - 1;

    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position > 8
    ) {
      return sock.sendMessage(sender, {
        text: '❌ Choose a position from 1 to 9.'
      });
    }

    if (game.board[position] !== ' ') {
      return sock.sendMessage(sender, {
        text: '❌ That position is already occupied.'
      });
    }

    game.board[position] = 'X';

    let result = winner(game.board);

    if (result === 'X') {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text:
          `🎉 *YOU WIN!*\n\n${board(game.board)}`
      });
    }

    if (result === 'draw') {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text:
          `🤝 *DRAW!*\n\n${board(game.board)}`
      });
    }

    const empty = game.board
      .map((value, index) =>
        value === ' ' ? index : null
      )
      .filter(index => index !== null);

    const botMove =
      empty[Math.floor(Math.random() * empty.length)];

    game.board[botMove] = 'O';

    result = winner(game.board);

    if (result === 'O') {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text:
          `🤖 *BOT WINS!*\n\n${board(game.board)}`
      });
    }

    if (result === 'draw') {
      games.delete(sender);

      return sock.sendMessage(sender, {
        text:
          `🤝 *DRAW!*\n\n${board(game.board)}`
      });
    }

    await sock.sendMessage(sender, {
      text:
        `🎮 *TIC-TAC-TOE*\n\n` +
        `${board(game.board)}\n\n` +
        `Your turn — choose 1-9.`
    });
  }
};
