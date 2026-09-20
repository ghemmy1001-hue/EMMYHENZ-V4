module.exports = {
  name: 'calculator',
  description: 'Calculate a mathematical expression',

  async execute(sock, sender, args) {
    const expression = args.join(' ').trim();

    if (!expression) {
      return sock.sendMessage(sender, {
        text:
          '🧮 *CALCULATOR*\n\n' +
          'Example:\n' +
          '.calculator 25 * 4 + 10'
      });
    }

    // Only allow basic mathematical characters.
    if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid mathematical expression.'
      });
    }

    try {
      const result = Function(
        `"use strict"; return (${expression})`
      )();

      if (
        typeof result !== 'number' ||
        !Number.isFinite(result)
      ) {
        throw new Error('Invalid result');
      }

      await sock.sendMessage(sender, {
        text:
          `🧮 *CALCULATOR*\n\n` +
          `Expression: ${expression}\n` +
          `Result: *${result}*`
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Could not calculate that expression.'
      });
    }
  }
};
