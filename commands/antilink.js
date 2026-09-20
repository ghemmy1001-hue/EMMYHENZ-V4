const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antilink',
  description: 'Toggle automatic link protection',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const action = (args[0] || '').toLowerCase();

    if (!['on', 'off'].includes(action)) {
      const status = security.get(sender, 'antilink');

      return sock.sendMessage(sender, {
        text: `🔗 Antilink is currently *${status ? 'ON' : 'OFF'}*.\n\nUsage: .antilink on/off`
      });
    }

    const enabled = action === 'on';

    security.set(sender, 'antilink', enabled);

    await sock.sendMessage(sender, {
      text: `🔗 Antilink has been turned *${enabled ? 'ON' : 'OFF'}*.`
    });
  }
};
