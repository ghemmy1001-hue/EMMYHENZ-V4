const g = require('../utils/group');

module.exports = {
  name: 'simp',
  description: 'Generate a fun simp percentage',

  async execute(sock, sender, args, msg) {
    const target = g.getTargetJid(msg, args);

    const percentage =
      Math.floor(Math.random() * 101);

    if (target) {
      return sock.sendMessage(sender, {
        text:
          `💘 @${target.split('@')[0]} is *${percentage}%* simp 😂`,
        mentions: [target]
      });
    }

    await sock.sendMessage(sender, {
      text:
        `💘 Your simp level is *${percentage}%* 😂`
    });
  }
};
