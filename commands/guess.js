module.exports = {
  name: 'guess',
  description: 'Guess a number from 1 to 10',
  async execute(sock, sender, args) {
    const guess = parseInt(args[0]);

    if (isNaN(guess) || guess < 1 || guess > 10) {
      return sock.sendMessage(sender, {
        text: '🎯 Guess a number from 1 to 10.\n\nExample: .guess 7'
      });
    }

    const answer = Math.floor(Math.random() * 10) + 1;

    await sock.sendMessage(sender, {
      text: guess === answer
        ? `🎉 Correct! The number was ${answer}.`
        : `❌ Not this time!\n\nYour guess: ${guess}\nNumber: ${answer}`
    });
  }
};
