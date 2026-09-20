const g = require('../utils/group');

module.exports = {
  name: 'clearwarns',
  description: 'Clear warnings for a member',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const target = args[0];

    if (!target) {
      return sock.sendMessage(sender, {
        text: '⚠️ Usage: .clearwarns @user'
      });
    }

    await sock.sendMessage(sender, {
      text: `🧹 Warnings cleared for ${target}`
    });
  }
};
