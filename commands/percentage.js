module.exports = {
  name: 'percentage',
  description: 'Calculate a percentage',

  async execute(sock, sender, args) {
    const percent = Number(args[0]);
    const value = Number(args[1]);

    if (
      !Number.isFinite(percent) ||
      !Number.isFinite(value)
    ) {
      return sock.sendMessage(sender, {
        text:
          '📊 Usage: .percentage <percent> <value>\n\nExample: .percentage 20 500'
      });
    }

    const result =
      (percent / 100) * value;

    await sock.sendMessage(sender, {
      text:
`📊 *PERCENTAGE*

${percent}% of ${value}

= *${result}*`
    });
  }
};
