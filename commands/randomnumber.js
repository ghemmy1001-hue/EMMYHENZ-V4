module.exports = {
  name: 'randomnumber',
  description: 'Generate a random number',

  async execute(sock, sender, args) {
    const min =
      Number.isFinite(Number(args[0]))
        ? Number(args[0])
        : 1;

    const max =
      Number.isFinite(Number(args[1]))
        ? Number(args[1])
        : 100;

    if (min > max) {
      return sock.sendMessage(sender, {
        text: '❌ Minimum cannot be greater than maximum.'
      });
    }

    const number =
      Math.floor(
        Math.random() * (max - min + 1)
      ) + min;

    await sock.sendMessage(sender, {
      text:
`🎲 *RANDOM NUMBER*

Range: *${min} - ${max}*

🎯 Result: *${number}*`
    });
  }
};
