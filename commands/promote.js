const g = require('../utils/group');

module.exports = {
  name: 'promote',
  description: 'Promote a member to admin',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '❌ Usage: .promote @user\n\nYou can also reply to their message.'
      });
    }

    try {
      await sock.groupParticipantsUpdate(sender, [target], 'promote');

      await sock.sendMessage(sender, {
        text: '👑 Member promoted to admin successfully.'
      });
    } catch (error) {
      console.error('Promote error:', error);

      await sock.sendMessage(sender, {
        text: '❌ I could not promote that member.'
      });
    }
  }
};
