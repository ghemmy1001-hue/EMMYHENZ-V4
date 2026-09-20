const g = require('../utils/group');

module.exports = {
  name: 'demoteall',
  description: 'Demote group admins',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const botId =
      sock.user?.id?.split(':')[0];

    const admins = (metadata.participants || [])
      .filter(p =>
        p.admin &&
        p.id &&
        !p.id.startsWith(botId || '___')
      )
      .map(p => p.id);

    if (!admins.length) {
      return sock.sendMessage(sender, {
        text: 'ℹ️ No admins available to demote.'
      });
    }

    try {
      await sock.groupParticipantsUpdate(
        sender,
        admins,
        'demote'
      );

      await sock.sendMessage(sender, {
        text:
          `⬇️ Demoted *${admins.length}* admin(s).`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Demote failed.\n\n${error.message}`
      });
    }
  }
};
