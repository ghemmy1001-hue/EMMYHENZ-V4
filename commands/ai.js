const { askAI } = require('../utils/ai');

module.exports = {
  name: 'ai',
  description: 'Chat with AI',

  async execute(sock, sender, args) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sock.sendMessage(sender, {
        text:
          '🤖 *EMMY AI*\n\n' +
          'Ask me anything.\n\n' +
          'Example:\n' +
          '.ai explain HTML to me'
      });
    }

    await sock.sendMessage(sender, {
      text: '🤖 Thinking...'
    });

    try {
      const answer = await askAI(
        prompt,
        'openai/gpt-4o-mini'
      );

      await sock.sendMessage(sender, {
        text:
          `🤖 *EMMY AI*\n\n${answer}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ AI error:\n${error.message}`
      });
    }
  }
};
