const g = require('../utils/group');

module.exports = {
  name: 'getpp',
  description: 'Get a profile picture',

  async execute(sock, sender, args, msg) {
    const target =
      g.getTargetJid(msg, args) ||
      sender;

    try {
      const url =
        await sock.profilePictureUrl(
          target,
          'image'
        );

      await sock.sendMessage(sender, {
        image: { url },
        caption:
          `🖼️ Profile picture of @${target.split('@')[0]}`,
        mentions: [target]
      });

    } catch {
      await sock.sendMessage(sender, {
        text:
          '❌ This user does not have an accessible profile picture.'
      });
    }
  }
};
