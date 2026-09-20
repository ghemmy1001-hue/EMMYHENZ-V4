const g = require('../utils/group');

module.exports = {
  name: 'mentionrandom',
  description: 'Randomly mention several group members',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    let amount =
      parseInt(args[0], 10);

    if (!Number.isInteger(amount)) {
      amount = 3;
    }

    amount =
      Math.max(
        1,
        Math.min(amount, 10)
      );

    const metadata =
      await sock.groupMetadata(sender);

    const members =
      (metadata.participants || [])
        .map(p => p.id || p.jid)
        .filter(Boolean);

    if (!members.length) {
      return sock.sendMessage(sender, {
        text: '❌ No members found.'
      });
    }

    const shuffled =
      [...members].sort(
        () => Math.random() - 0.5
      );

    const selected =
      shuffled.slice(
        0,
        Math.min(amount, shuffled.length)
      );

    const text =
      selected
        .map(
          jid => `👤 @${jid.split('@')[0]}`
        )
        .join('\n');

    await sock.sendMessage(sender, {
      text:
`🎲 *RANDOM MEMBERS*

${text}`,

      mentions: selected
    });
  }
};
