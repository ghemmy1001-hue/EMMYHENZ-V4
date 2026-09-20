module.exports = {
  name: 'base64',
  description: 'Encode or decode Base64',

  async execute(sock, sender, args) {
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text:
          '🔤 *BASE64*\n\n' +
          '.base64 hello world\n' +
          '.base64 decode SGVsbG8='
      });
    }

    const parts = input.split(/\s+/);
    const mode = parts[0].toLowerCase();

    try {
      if (mode === 'decode') {
        const encoded = parts.slice(1).join('');

        if (!encoded) {
          return sock.sendMessage(sender, {
            text: '❌ Provide Base64 text to decode.'
          });
        }

        const decoded = Buffer
          .from(encoded, 'base64')
          .toString('utf8');

        return sock.sendMessage(sender, {
          text: `🔓 ${decoded}`
        });
      }

      const encoded = Buffer
        .from(input, 'utf8')
        .toString('base64');

      await sock.sendMessage(sender, {
        text:
          `🔐 *BASE64 ENCODED*\n\n${encoded}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Base64 error: ${error.message}`
      });
    }
  }
};
