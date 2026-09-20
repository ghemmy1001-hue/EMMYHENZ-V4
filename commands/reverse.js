module.exports = {
  name: 'reverse',
  description: 'Reverse text',

  async execute(sock, sender, args) {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .reverse hello world'
      });
    }

    await sock.sendMessage(sender, {
      text: text.split('').reverse().join('')
    });
  }
};
