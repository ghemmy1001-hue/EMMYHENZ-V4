const g = require('../utils/group');

module.exports = {
  name: 'kickall',
  description: 'Remove regular members from the group',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const botJid =
      sock.user?.id?.split(':')[0] + '@s.whatsapp.net';

    const targets = metadata.participants
      .filter(p => {
        const jid = p.id;

        const isAdmin =
          p.admin === 'admin' ||
          p.admin === 'superadmin';

        return jid !== botJid && !isAdmin;
      })
      .map(p => p.id);

    if (!targets.length) {
      return sock.sendMessage(sender, {
        text: 'ℹ️ There are no regular members to remove.'
      });
    }

    await sock.sendMessage(sender, {
      text:
        `⚠️ *KICKALL*\n\n` +
        `Found *${targets.length}* regular members.\n` +
        `Removing them now...`
    });

    try {
      for (let i = 0; i < targets.length; i += 5) {
        const batch = targets.slice(i, i + 5);

        await sock.groupParticipantsUpdate(
          sender,
          batch,
          'remove'
        );

        await new Promise(resolve =>
          setTimeout(resolve, 1200)
        );
      }

      await sock.sendMessage(sender, {
        text:
          `✅ *KICKALL COMPLETE*\n\n` +
          `Removed: *${targets.length}* members.\n` +
          `Admins and the bot were protected.`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Kickall stopped.\n\n` +
          `Reason: ${error.message}`
      });
    }
  }
};
