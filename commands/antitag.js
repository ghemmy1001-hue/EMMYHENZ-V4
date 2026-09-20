const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antitag',
  description: 'Toggle mention-spam protection',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const action = (args[0] || '').toLowerCase();

    if (!['on', 'off'].includes(action)) {
      const status = security.get(sender, 'antitag');

      return sock.sendMessage(sender, {
        text:
          `🏷️ Antitag is currently *${status ? 'ON' : 'OFF'}*.\n\n` +
          `Usage: .antitag on/off`
      });
    }

    const enabled = action === 'on';

    security.set(sender, 'antitag', enabled);

    await sock.sendMessage(sender, {
      text: `🏷️ Antitag has been turned *${enabled ? 'ON' : 'OFF'}*.`
    });
  }
};
