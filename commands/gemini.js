const { askAI } = require('../utils/ai');

module.exports = {
  name: 'gemini',
  description: 'Chat with Gemini',

  async execute(sock, sender, args) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sock.sendMessage(sender, {
        text:
          '✨ *GEMINI*\n\n' +
          'Example:\n' +
          '.gemini explain photosynthesis'
      });
    }

    await sock.sendMessage(sender, {
      text: '✨ Gemini is thinking...'
    });

    try {
      const answer = await askAI(
        prompt,
        'google/gemini-2.0-flash-001'
      );

      await sock.sendMessage(sender, {
        text:
          `✨ *GEMINI*\n\n${answer}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Gemini error:\n${error.message}`
      });
    }
  }
};
