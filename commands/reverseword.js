module.exports = {
  name: 'reverseword',
  description: 'Reverse text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🔄 Usage: .reverseword hello world'
      });
    }

    const reversed =
      [...text].reverse().join('');

    await sock.sendMessage(sender, {
      text:
`🔄 *REVERSED*

Original:
${text}

Result:
${reversed}`
    });
  }
};
