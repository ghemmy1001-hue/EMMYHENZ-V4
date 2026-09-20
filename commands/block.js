const g = require('../utils/group');

module.exports = {
  name: 'block',
  description: 'Block a contact',

  async execute(sock, sender, args, msg) {
    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text:
          '🚫 *BLOCK*\n\n' +
          'Tag, reply to a user, or provide their number.\n\n' +
          'Example:\n' +
          '.block 2348012345678'
      });
    }

    try {
      await sock.updateBlockStatus(
        target,
        'block'
      );

      await sock.sendMessage(sender, {
        text:
          `🚫 @${target.split('@')[0]} has been blocked.`,
        mentions: [target]
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Failed to block contact.\n\n${error.message}`
      });
    }
  }
};
