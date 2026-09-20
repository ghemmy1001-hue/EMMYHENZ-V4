const g = require('../utils/group');

module.exports = {
  name: 'leavegc',
  description: 'Make the bot leave the group',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    await sock.sendMessage(sender, {
      text: '👋 DEV-X is leaving this group...'
    });

    await sock.groupLeave(sender);
  }
};
