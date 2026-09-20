const g = require('../utils/group');

const roasts = [
  'Your Wi-Fi has more personality than you. 😂',
  'Even Google needs a break after searching for your common sense. 😂',
  'Your jokes need a software update. 💀',
  'You bring lag to real life. 😭',
  'Your confidence is running on unlimited data. 😂',
  'Even the loading screen gave up on you. 💀'
];

module.exports = {
  name: 'roastme',
  description: 'Give a playful roast',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '🔥 Reply to a member or mention them.'
      });
    }

    const roast =
      roasts[Math.floor(Math.random() * roasts.length)];

    await sock.sendMessage(sender, {
      text:
`🔥 *ROAST MODE*

@${target.split('@')[0]}

${roast}

😂 Just for fun!`,
      mentions: [target]
    });
  }
};
