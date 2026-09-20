const g = require('../utils/group');

module.exports = {
  name: 'roast',
  description: 'Send a playful roast',

  async execute(sock, sender, args, msg) {
    const target = g.getTargetJid(msg, args);

    const roasts = [
      'Your Wi-Fi has more personality than you 😂',
      'Even Google needs a moment to understand you 😂',
      'Your brain is still loading... ⏳😂',
      'You brought confidence, but forgot the instructions 😂',
      'You are proof that updates do not always improve things 😂'
    ];

    const roast =
      roasts[Math.floor(Math.random() * roasts.length)];

    if (target) {
      return sock.sendMessage(sender, {
        text:
          `😂 @${target.split('@')[0]}\n\n${roast}`,
        mentions: [target]
      });
    }

    await sock.sendMessage(sender, {
      text: `😂 ${roast}`
    });
  }
};
