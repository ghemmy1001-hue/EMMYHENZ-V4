const g = require('../utils/group');

module.exports = {
  name: 'shipme',
  description: 'Calculate a fun compatibility percentage',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const targets = [];

    const target = g.getTargetJid(msg, args);

    if (target) {
      targets.push(target);
    }

    const mentioned =
      msg?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    for (const jid of mentioned) {
      if (!targets.includes(jid)) {
        targets.push(jid);
      }
    }

    if (targets.length < 1) {
      return sock.sendMessage(sender, {
        text: '💘 Reply to or mention someone.'
      });
    }

    const first = sender;
    const second = targets[0];

    const score =
      Math.floor(Math.random() * 101);

    await sock.sendMessage(sender, {
      text:
`💘 *SHIP METER*

@${first.split('@')[0]}
❤️
@${second.split('@')[0]}

💞 Compatibility: *${score}%*

😂 Just for fun!`,
      mentions: [first, second]
    });
  }
};
