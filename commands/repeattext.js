module.exports = {
  name: 'repeattext',
  description: 'Repeat text multiple times',

  async execute(sock, sender, args) {
    const amount = parseInt(args[0], 10);
    const text = args.slice(1).join(' ').trim();

    if (
      !Number.isInteger(amount) ||
      amount < 1 ||
      amount > 10 ||
      !text
    ) {
      return sock.sendMessage(sender, {
        text:
          '🔁 Usage: .repeattext <1-10> <text>'
      });
    }

    const result =
      Array(amount)
        .fill(text)
        .map((item, i) => `${i + 1}. ${item}`)
        .join('\n');

    await sock.sendMessage(sender, {
      text:
`🔁 *REPEAT*

${result}`
    });
  }
};
