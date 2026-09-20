const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antitaggroup',
  description: 'Toggle group mention protection',

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
          `📢 *ANTITAGGROUP*\n\n` +
          `Status: *${settings.antitaggroup ? 'ON' : 'OFF'}*\n\n` +
          `.antitaggroup on\n` +
          `.antitaggroup off`
      });
    }

    security.setGroupSetting(
      sender,
      'antitaggroup',
      option === 'on'
    );

    await sock.sendMessage(sender, {
      text:
        `📢 Antitaggroup has been turned *${option.toUpperCase()}*.`
    });
  }
};
