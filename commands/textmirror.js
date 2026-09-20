module.exports = {
  name: 'textmirror',
  description: 'Mirror text with separators',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .textmirror hello'
      });
    }

    const mirrored =
      text.split('').reverse().join('');

    await sock.sendMessage(sender, {
      text:
`🪞 *TEXT MIRROR*

Original:
${text}

Mirror:
${mirrored}`
    });
  }
};
