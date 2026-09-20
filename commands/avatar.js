module.exports = {
  name: 'avatar',
  description: 'Get a WhatsApp profile picture',

  async execute(sock, sender, args, msg) {
    try {
      const context =
        msg.message?.extendedTextMessage?.contextInfo;

      const target =
        context?.mentionedJid?.[0] ||
        context?.participant ||
        sender;

      const url = await sock.profilePictureUrl(
        target,
        'image'
      ).catch(() => null);

      if (!url) {
        return sock.sendMessage(sender, {
          text: '❌ No profile picture found.'
        });
      }

      await sock.sendMessage(sender, {
        image: { url },
        caption: `🖼️ Profile picture of @${target.split('@')[0]}`,
        mentions: [target]
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Avatar error:\n${error.message}`
      });
    }
  }
};
