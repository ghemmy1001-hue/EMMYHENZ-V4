module.exports = {
  name: 'binaryencode',
  description: 'Convert text to binary',

  async execute(sock, sender, args) {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .binaryencode hello'
      });
    }

    const result = [...text]
      .map(char =>
        char.charCodeAt(0)
          .toString(2)
          .padStart(8, '0')
      )
      .join(' ');

    await sock.sendMessage(sender, {
      text:
`🔢 *BINARY ENCODE*

Input:
${text}

Output:
${result}`
    });
  }
};
