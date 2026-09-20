module.exports = {
  name: 'bio',
  description: 'Get a WhatsApp profile bio',

  async execute(sock, sender, args, msg) {
    try {
      const context =
        msg.message?.extendedTextMessage?.contextInfo;

      const target =
        context?.mentionedJid?.[0] ||
        context?.participant ||
        sender;

      const status =
        await sock.fetchStatus(target);

      const bio =
        status?.status ||
        'No bio available.';

      await sock.sendMessage(sender, {
        text:
`👤 *PROFILE BIO*

📱 User: @${target.split('@')[0]}

📝 Bio:
${bio}`,
        mentions: [target]
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not retrieve bio.\n\n${error.message}`
      });
    }
  }
};
