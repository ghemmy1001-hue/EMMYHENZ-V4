module.exports = {
  name: 'choose',
  description: 'Randomly choose an option',

  async execute(sock, sender, args) {
    const options = args
      .join(' ')
      .split('|')
      .map(x => x.trim())
      .filter(Boolean);

    if (options.length < 2) {
      return sock.sendMessage(sender, {
        text:
          `🎯 *CHOOSE*\n\n` +
          `Example:\n` +
          `.choose Free Fire | CODM | PUBG`
      });
    }

    const choice =
      options[Math.floor(Math.random() * options.length)];

    await sock.sendMessage(sender, {
      text:
        `🎯 *RANDOM CHOICE*\n\n` +
        `Options: ${options.join(' • ')}\n\n` +
        `👉 Selected: *${choice}*`
    });
  }
};
