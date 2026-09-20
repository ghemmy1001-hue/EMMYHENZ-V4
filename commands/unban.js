const g = require('../utils/group');

module.exports = {
  name: 'unban',
  description: 'Re-add a removed member',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text:
          '❌ *UNBAN*\n\n' +
          'Tag the member, reply to their message, or provide their number.\n\n' +
          'Example:\n' +
          '.unban 2348012345678'
      });
    }

    try {
      await sock.groupParticipantsUpdate(
        sender,
        [target],
        'add'
      );

      await sock.sendMessage(sender, {
        text:
          `✅ @${target.split('@')[0]} has been re-added to the group.`,
        mentions: [target]
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Could not re-add the member.\n\n` +
          `Reason: ${error.message}`
      });
    }
  }
};
