const g = require('../utils/group');

module.exports = {
  name: 'topmembers',
  description: 'Show group member list',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata =
        await g.getGroupData(sock, sender);

      const participants =
        metadata.participants || [];

      if (!participants.length) {
        return sock.sendMessage(sender, {
          text: '❌ No group members found.'
        });
      }

      const members = participants
        .slice(0, 20)
        .map((p, index) => {
          const jid = p.id || p.jid;

          if (!jid) {
            return `${index + 1}. Unknown member`;
          }

          const role =
            p.admin === 'superadmin'
              ? ' 👑'
              : p.admin === 'admin'
                ? ' 🛡️'
                : '';

          return `${index + 1}. @${jid.split('@')[0]}${role}`;
        });

      const mentions = participants
        .slice(0, 20)
        .map(p => p.id || p.jid)
        .filter(Boolean);

      await sock.sendMessage(sender, {
        text:
          `╔══════════════════════╗\n` +
          `║    👥 TOP MEMBERS    ║\n` +
          `╚══════════════════════╝\n\n` +
          members.join('\n') +
          `\n\n📊 Showing up to 20 members.\n` +
          `👑 Admin  🛡️ Group admin`,
        mentions
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Could not retrieve members.\n\n` +
          `Reason: ${error.message}`
      });
    }
  }
};
