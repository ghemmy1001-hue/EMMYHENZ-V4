module.exports = {
  name: 'binarydecode2',
  description: 'Convert binary to text',

  async execute(sock, sender, args) {
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text: 'Usage: .binarydecode2 01001000 01101001'
      });
    }

    try {
      const result = input
        .split(/\s+/)
        .map(bin => {
          if (!/^[01]+$/.test(bin)) {
            throw new Error('Invalid binary');
          }

          return String.fromCharCode(
            parseInt(bin, 2)
          );
        })
        .join('');

      await sock.sendMessage(sender, {
        text:
`🔓 *BINARY DECODE*

Input:
${input}

Output:
${result}`
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Invalid binary input.'
      });
    }
  }
};
