const g = require('../utils/group');

module.exports = {
  name: 'groupicon',
  description: 'Show group profile picture',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const url = await sock.profilePictureUrl(
        sender,
        'image'
      );

      await sock.sendMessage(sender, {
        image: { url },
        caption: '🖼️ Group profile picture'
      });

    } catch {
      await sock.sendMessage(sender, {
        text: '❌ This group does not have a profile picture.'
      });
    }
  }
};
