const g = require('../utils/group');

module.exports = {
  name: 'compliment',
  description: 'Send a friendly compliment',

  async execute(sock, sender, args, msg) {
    const target = g.getTargetJid(msg, args);

    const compliments = [
      'You are doing great! 🌟',
      'Your energy is awesome! 🔥',
      'Keep being amazing! 💯',
      'You have a great vibe! 😎',
      'You are seriously talented! 🚀'
    ];

    const text =
      compliments[Math.floor(Math.random() * compliments.length)];

    if (target) {
      return sock.sendMessage(sender, {
        text: `💙 @${target.split('@')[0]}, ${text}`,
        mentions: [target]
      });
    }

    await sock.sendMessage(sender, {
      text: `💙 ${text}`
    });
  }
};
