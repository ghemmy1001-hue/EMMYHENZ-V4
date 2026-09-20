module.exports = {
  name: 'hexdecode',
  description: 'Convert hexadecimal to text',

  async execute(sock, sender, args) {
    const input =
      args.join('').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text: 'Usage: .hexdecode 48656c6c6f'
      });
    }

    if (
      !/^[0-9a-f]+$/i.test(input) ||
      input.length % 2 !== 0
    ) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid hexadecimal input.'
      });
    }

    try {
      const result =
        Buffer.from(input, 'hex')
          .toString('utf8');

      await sock.sendMessage(sender, {
        text:
`🔓 *HEX DECODE*

Input:
${input}

Output:
${result}`
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Could not decode hexadecimal.'
      });
    }
  }
};
