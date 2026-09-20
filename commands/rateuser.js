const g = require('../utils/group');

module.exports = {
  name: 'rateuser',
  description: 'Give a fun random rating',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '⭐ Reply to or mention someone.'
      });
    }

    const rating =
      Math.floor(Math.random() * 101);

    await sock.sendMessage(sender, {
      text:
`⭐ *USER RATING*

@${target.split('@')[0]}

🏆 Rating: *${rating}/100*

😂 Just for fun!`,
      mentions: [target]
    });
  }
};
