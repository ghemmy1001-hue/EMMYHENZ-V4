const g = require('../utils/group');

module.exports = {
  name: 'admins2',
  description: 'Show detailed group admins',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await sock.groupMetadata(sender);

    const admins = (metadata.participants || [])
      .filter(p =>
        p.admin === 'admin' ||
        p.admin === 'superadmin'
      );

    if (!admins.length) {
      return sock.sendMessage(sender, {
        text: '👑 No admins found.'
      });
    }

    const mentions = admins.map(p => p.id);

    const lines = admins.map((p, i) => {
      const role =
        p.admin === 'superadmin'
          ? '👑 Owner'
          : '🛡️ Admin';

      return `${i + 1}. ${role} @${p.id.split('@')[0]}`;
    });

    await sock.sendMessage(sender, {
      text: `👑 *GROUP ADMINS*\n\n${lines.join('\n')}`,
      mentions
    });
  }
};
