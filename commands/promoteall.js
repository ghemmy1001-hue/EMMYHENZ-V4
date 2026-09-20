const g = require('../utils/group');

module.exports = {
  name: 'promoteall',
  description: 'Promote group members',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const members = metadata.participants || [];

    const targets = members
      .filter(p => !p.admin)
      .map(p => p.id)
      .filter(Boolean);

    if (!targets.length) {
      return sock.sendMessage(sender, {
        text: 'ℹ️ No non-admin members found.'
      });
    }

    try {
      await sock.groupParticipantsUpdate(
        sender,
        targets,
        'promote'
      );

      await sock.sendMessage(sender, {
        text:
          `👑 Promoted *${targets.length}* member(s) to admin.`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Promote failed.\n\n${error.message}`
      });
    }
  }
};
