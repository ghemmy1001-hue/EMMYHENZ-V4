module.exports = {
  name: 'base64decode2',
  description: 'Decode Base64 text',

  async execute(sock, sender, args) {
    const input =
      args.join('').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text: 'Usage: .base64decode2 SGVsbG8='
      });
    }

    try {
      const result =
        Buffer.from(input, 'base64')
          .toString('utf8');

      await sock.sendMessage(sender, {
        text:
`🔓 *BASE64 DECODE*

Input:
${input}

Output:
${result}`
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Invalid Base64 input.'
      });
    }
  }
};
