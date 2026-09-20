const g = require('../utils/group');

const compliments = [
  'You have great energy! ✨',
  'You are seriously impressive! 🔥',
  'Your vibe is unmatched! 😎',
  'You bring good energy wherever you go! 💫',
  'You are one of a kind! 👑',
  'Your confidence is powerful! 💯',
  'You have a great personality! ❤️'
];

module.exports = {
  name: 'complimentme',
  description: 'Compliment a group member',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '💬 Reply to a member or mention them.'
      });
    }

    const compliment =
      compliments[
        Math.floor(Math.random() * compliments.length)
      ];

    await sock.sendMessage(sender, {
      text:
`💖 *COMPLIMENT*

@${target.split('@')[0]}

${compliment}`,
      mentions: [target]
    });
  }
};
