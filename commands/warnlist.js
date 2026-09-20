const g = require('../utils/group');

module.exports = {
  name: 'warnlist',
  description: 'Show warning list',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    await sock.sendMessage(sender, {
      text: '⚠️ Warning list is currently empty.'
    });
  }
};
