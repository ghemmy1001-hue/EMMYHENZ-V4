const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antiviewonce',
  description: 'Toggle view-once protection',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata =
      await g.requireBotAdmin(sock, sender);

    if (!metadata) return;

    const option =
      (args[0] || '').toLowerCase();

    if (!['on', 'off'].includes(option)) {
      const settings =
        security.getGroupSettings(sender);

      return sock.sendMessage(sender, {
        text:
          `👁️ *ANTIVIEWONCE*\n\n` +
          `Status: *${settings.antiviewonce ? 'ON' : 'OFF'}*\n\n` +
          `.antiviewonce on\n` +
          `.antiviewonce off`
      });
    }

    security.setGroupSetting(
      sender,
      'antiviewonce',
      option === 'on'
    );

    await sock.sendMessage(sender, {
      text:
        `👁️ Antiviewonce has been turned *${option.toUpperCase()}*.`
    });
  }
};
