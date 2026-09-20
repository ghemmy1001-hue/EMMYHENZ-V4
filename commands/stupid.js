const g = require('../utils/group');

module.exports = {
  name: 'stupid',
  description: 'Generate a playful random rating',

  async execute(sock, sender, args, msg) {
    const target = g.getTargetJid(msg, args);

    const percentage =
      Math.floor(Math.random() * 101);

    if (target) {
      return sock.sendMessage(sender, {
        text:
          `😂 @${target.split('@')[0]} got a *${percentage}%* silly rating!`,
        mentions: [target]
      });
    }

    await sock.sendMessage(sender, {
      text:
        `😂 Your silly rating is *${percentage}%*!`
    });
  }
};
