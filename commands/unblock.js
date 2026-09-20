const g = require('../utils/group');

module.exports = {
  name: 'unblock',
  description: 'Unblock a contact',

  async execute(sock, sender, args, msg) {
    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text:
          '🔓 *UNBLOCK*\n\n' +
          'Tag, reply to a user, or provide their number.'
      });
    }

    try {
      await sock.updateBlockStatus(
        target,
        'unblock'
      );

      await sock.sendMessage(sender, {
        text:
          `✅ @${target.split('@')[0]} has been unblocked.`,
        mentions: [target]
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Failed to unblock contact.\n\n${error.message}`
      });
    }
  }
};
