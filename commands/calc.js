module.exports = {
  name: 'calc',
  description: 'Calculate a mathematical expression',

  async execute(sock, sender, args) {
    const expression = args.join(' ').trim();

    if (!expression) {
      return sock.sendMessage(sender, {
        text: '🧮 Example: .calc 25 * 4 + 10'
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

      await sock.sendMessage(sender, {
        text: `🧮 *CALCULATOR*\n\n${expression} = *${result}*`
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ Invalid calculation.'
      });
    }
  }
};
