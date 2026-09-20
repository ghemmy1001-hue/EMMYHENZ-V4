const g = require('../utils/group');

module.exports = {
  name: 'demote',
  description: 'Remove admin privileges',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '❌ Usage: .demote @user\n\nYou can also reply to their message.'
      });
    }

    try {
      await sock.groupParticipantsUpdate(sender, [target], 'demote');

      await sock.sendMessage(sender, {
        text: '⬇️ Admin privileges removed.'
      });
    } catch (error) {
      console.error('Demote error:', error);

      await sock.sendMessage(sender, {
        text: '❌ I could not demote that member.'
      });
    }
  }
};
