module.exports = {
  name: 'random',
  description: 'Generate a random number',

  async execute(sock, sender, args) {
    const max = Number(args[0]) || 100;

    if (
      !Number.isInteger(max) ||
      max < 1 ||
      max > 1000000
    ) {
      return sock.sendMessage(sender, {
        text: '❌ Use a whole number between 1 and 1,000,000.'
      });
    }

    const result =
      Math.floor(Math.random() * max) + 1;

    await sock.sendMessage(sender, {
      text:
        `🎯 *RANDOM NUMBER*\n\n` +
        `Range: 1-${max}\n` +
        `Result: *${result}*`
    });
  }
};
