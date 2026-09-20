const g = require('../utils/group');

module.exports = {
  name: 'groupage',
  description: 'Show when the group was created',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await sock.groupMetadata(sender);

      if (!metadata.creation) {
        return sock.sendMessage(sender, {
          text: '❌ Group creation date is not available.'
        });
      }

      const created = new Date(
        metadata.creation * 1000
      );

      const date =
        created.toLocaleString();

      const ageMs =
        Date.now() - created.getTime();

      const days =
        Math.floor(
          ageMs / 86400000
        );

      await sock.sendMessage(sender, {
        text:
`📅 *GROUP AGE*

🏷️ Group: ${metadata.subject}

🗓️ Created: ${date}

⏳ Age: *${days} day(s)*`
      });

    } catch (error) {
      console.log('❌ groupage error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to determine the group age.'
      });
    }
  }
};
