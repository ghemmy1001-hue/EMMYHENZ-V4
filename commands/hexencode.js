module.exports = {
  name: 'hexencode',
  description: 'Convert text to hexadecimal',

  async execute(sock, sender, args) {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .hexencode hello'
      });
    }

    const result =
      Buffer.from(text, 'utf8').toString('hex');

    await sock.sendMessage(sender, {
      text:
`🔢 *HEX ENCODE*

Input:
${text}

Output:
${result}`
    });
  }
};
