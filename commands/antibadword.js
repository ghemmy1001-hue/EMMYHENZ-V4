const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antibadword',
  description: 'Toggle bad-word filtering',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const action = (args[0] || '').toLowerCase();

    if (!['on', 'off'].includes(action)) {
      const status = security.get(sender, 'antibadword');

      return sock.sendMessage(sender, {
        text:
          `🛡️ Antibadword is currently *${status ? 'ON' : 'OFF'}*.\n\n` +
          `Usage: .antibadword on/off`
      });
    }

    const enabled = action === 'on';

    security.set(sender, 'antibadword', enabled);

    await sock.sendMessage(sender, {
      text: `🛡️ Antibadword has been turned *${enabled ? 'ON' : 'OFF'}*.`
    });
  }
};
