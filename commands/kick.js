const g = require('../utils/group');

module.exports = {
  name: 'kick',
  description: 'Remove a member from the group',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '❌ Usage: .kick @user\n\nYou can also reply to their message.'
      });
    }

    try {
      await sock.groupParticipantsUpdate(sender, [target], 'remove');

      await sock.sendMessage(sender, {
        text: '✅ Member kicked successfully.'
      });
    } catch (error) {
      console.error('Kick error:', error);

      await sock.sendMessage(sender, {
        text: '❌ I could not remove that member.'
      });
    }
  }
};
