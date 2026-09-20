const g = require('../utils/group');

module.exports = {
  name: 'ban',
  description: 'Remove a member from the group',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '❌ Mention, reply to, or provide the number of the member to ban.'
      });
    }

    try {
      await sock.groupParticipantsUpdate(
        sender,
        [target],
        'remove'
      );

      await sock.sendMessage(sender, {
        text: '✅ Member removed from the group.'
      });
    } catch (error) {
      console.error('Ban error:', error.message);

      await sock.sendMessage(sender, {
        text: `❌ Could not remove member.\n${error.message}`
      });
    }
  }
};
