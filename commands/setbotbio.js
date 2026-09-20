module.exports = {
  name: 'setbotbio',
  description: 'Change bot profile status',

  async execute(sock, sender, args) {
    const bio = args.join(' ').trim();

    if (!bio) {
      return sock.sendMessage(sender, {
        text:
          '📝 *SETBOTBIO*\n\n' +
          'Example:\n' +
          '.setbotbio DEV-X WhatsApp Bot 🚀'
      });
    }

    if (bio.length > 139) {
      return sock.sendMessage(sender, {
        text: '❌ Bio is too long. Keep it under 139 characters.'
      });
    }

    try {
      await sock.updateProfileStatus(bio);

      await sock.sendMessage(sender, {
        text:
          `✅ Bot bio updated.\n\n` +
          `📝 ${bio}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Failed to update bot bio.\n\n` +
          `Reason: ${error.message}`
      });
    }
  }
};
