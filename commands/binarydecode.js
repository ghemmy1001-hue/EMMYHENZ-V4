module.exports = {
  name: 'binarydecode',
  description: 'Convert binary to text',

  async execute(sock, sender, args) {
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text:
          `🔢 *BINARY DECODE*\n\n` +
          `Usage:\n.binarydecode 01001000 01101001`
      });
    }

    try {
      const parts = input.split(/\s+/);

      if (!parts.every(x => /^[01]+$/.test(x))) {
        throw new Error('Invalid binary input');
      }

      const text = parts
        .map(binary => String.fromCharCode(parseInt(binary, 2)))
        .join('');

      await sock.sendMessage(sender, {
        text: `🔓 *DECODED TEXT*\n\n${text}`
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Invalid binary input.'
      });
    }
  }
};
