module.exports = {
  name: 'pick',
  description: 'Pick one option randomly',

  async execute(sock, sender, args) {
    const options = args
      .join(' ')
      .split('|')
      .map(x => x.trim())
      .filter(Boolean);

    if (options.length < 2) {
      return sock.sendMessage(sender, {
        text:
          '🎯 Usage:\n' +
          '.pick pizza | burger | chicken'
      });
    }

    const selected =
      options[Math.floor(Math.random() * options.length)];

    await sock.sendMessage(sender, {
      text:
        `🎯 *PICKED*\n\n` +
        `Options: ${options.length}\n` +
        `Result: *${selected}*`
    });
  }
};
