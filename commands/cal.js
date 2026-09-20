module.exports = {
  name: 'cal',
  description: 'Calculate a mathematical expression',
  async execute(sock, sender, args) {
    const expression = args.join(' ').trim();

    if (!expression) {
      return sock.sendMessage(sender, {
        text: '🧮 Usage: .cal 25 * 4 + 10'
      });
    }

    if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
      return sock.sendMessage(sender, {
        text: '❌ Only basic mathematical expressions are allowed.'
      });
    }

    try {
      const result = Function(
        `"use strict"; return (${expression})`
      )();

      if (!Number.isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      await sock.sendMessage(sender, {
        text: `🧮 *CALCULATOR*\n\n${expression} = *${result}*`
      });
    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Could not calculate that expression.'
      });
    }
  }
};
