const g = require('../utils/group');

module.exports = {
  name: 'groupname',
  description: 'Show current group name',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await sock.groupMetadata(sender);

    await sock.sendMessage(sender, {
      text: `👥 *GROUP NAME*\n\n${metadata.subject || 'Unknown'}`
    });
  }
};
