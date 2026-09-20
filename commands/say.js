module.exports = {
  name: 'say',
  description: 'Make the bot repeat text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .say Hello everyone!'
      });
    }

    await sock.sendMessage(sender, {
      text
    });
  }
};
