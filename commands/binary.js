module.exports = {
  name: 'binary',
  description: 'Convert text to binary or binary to text',

  async execute(sock, sender, args) {
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text:
          `💻 *BINARY*\n\n` +
          `.binary hello\n` +
          `.binary decode 01101000 01101001`
      });
    }

    const parts = input.split(/\s+/);
    const mode = parts[0].toLowerCase();

    if (mode === 'decode') {
      const binary = parts.slice(1);

      if (!binary.length) {
        return sock.sendMessage(sender, {
          text: '❌ Provide binary values to decode.'
        });
      }

      if (
        binary.some(
          value => !/^[01]{8}$/.test(value)
        )
      ) {
        return sock.sendMessage(sender, {
          text:
            '❌ Use 8-bit binary values, e.g. 01001000.'
        });
      }

      const text = binary
        .map(value =>
          String.fromCharCode(
            parseInt(value, 2)
          )
        )
        .join('');

      return sock.sendMessage(sender, {
        text: `🔓 ${text}`
      });
    }

    const text = input;

    const binary = [...text]
      .map(char =>
        char.charCodeAt(0)
          .toString(2)
          .padStart(8, '0')
      )
      .join(' ');

    await sock.sendMessage(sender, {
      text:
        `🔐 *BINARY*\n\n${binary}`
    });
  }
};
