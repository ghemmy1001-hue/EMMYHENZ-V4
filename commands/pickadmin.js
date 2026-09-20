const g = require('../utils/group');

module.exports = {
  name: 'pickadmin',
  description: 'Pick one group admin',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata =
      await sock.groupMetadata(sender);

    const admins =
      (metadata.participants || [])
        .filter(p =>
          p.admin === 'admin' ||
          p.admin === 'superadmin'
        )
        .map(p => p.id || p.jid)
        .filter(Boolean);

    if (!admins.length) {
      return sock.sendMessage(sender, {
        text: '❌ No admins found.'
      });
    }

    const target =
      admins[
        Math.floor(
          Math.random() * admins.length
        )
      ];

    await sock.sendMessage(sender, {
      text:
`👑 *ADMIN PICK*

@${target.split('@')[0]} has been selected.`,

      mentions: [target]
    });
  }
};
