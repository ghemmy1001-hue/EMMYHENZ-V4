const g = require('../utils/group');

module.exports = {
  name: 'gctime',
  description: 'Show group creation time',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await sock.groupMetadata(sender);

    const timestamp =
      metadata.creation ||
      metadata.creationTimestamp;

    if (!timestamp) {
      return sock.sendMessage(sender, {
        text: '❌ Group creation time is unavailable.'
      });
    }

    const date = new Date(
      Number(timestamp) * 1000
    );

    await sock.sendMessage(sender, {
      text:
        `🕐 *GROUP CREATED*\n\n` +
        `${date.toLocaleString()}`
    });
  }
};
