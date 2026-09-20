const g = require('../utils/group');

module.exports = {
  name: 'inactive',
  description: 'Show members whose activity cannot be determined',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata =
        await sock.groupMetadata(sender);

      const participants =
        metadata.participants || [];

      const members =
        participants.filter(
          p => !p.admin
        );

      /*
       * Baileys group metadata does not provide
       * reliable historical activity timestamps.
       *
       * Therefore this command reports the members
       * whose activity cannot currently be measured.
       */

      await sock.sendMessage(sender, {
        text:
`📊 *INACTIVE CHECK*

👥 Total members:
${participants.length}

👤 Non-admin members:
${members.length}

⚠️ WhatsApp does not provide reliable last-message
activity for all group members through Baileys.

So I cannot honestly identify inactive members
without maintaining message activity data.

💡 We can add activity tracking later.`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Inactive check failed.\n\n${error.message}`
      });
    }
  }
};
