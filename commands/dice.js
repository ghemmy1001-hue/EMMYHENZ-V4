module.exports = {
  name: 'dice',
  description: 'Roll a dice',

  async execute(sock, sender) {
    const result = Math.floor(Math.random() * 6) + 1;

    await sock.sendMessage(sender, {
      text:
        `🎲 *DICE ROLL*\n\n` +
        `You rolled: *${result}*`
    });
  }
};
