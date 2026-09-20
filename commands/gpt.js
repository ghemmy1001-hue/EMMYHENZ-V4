const { askAI } = require('../utils/ai');

module.exports = {
  name: 'gpt',
  description: 'Chat with GPT',

  async execute(sock, sender, args) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sock.sendMessage(sender, {
        text:
          '🧠 *GPT*\n\n' +
          'Example:\n' +
          '.gpt write a JavaScript function'
      });
    }

    await sock.sendMessage(sender, {
      text: '🧠 GPT is thinking...'
    });

    try {
      const answer = await askAI(
        prompt,
        'openai/gpt-4o-mini'
      );

      await sock.sendMessage(sender, {
        text:
          `🧠 *GPT*\n\n${answer}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ GPT error:\n${error.message}`
      });
    }
  }
};
