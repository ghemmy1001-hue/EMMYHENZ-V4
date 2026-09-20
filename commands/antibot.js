const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antibot',
  description: 'Toggle anti-bot protection',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata =
      await g.requireBotAdmin(sock, sender);

    if (!metadata) return;

    const option =
      (args[0] || '').toLowerCase();

    const enabled =
      security.get(sender, 'antibot');

    if (!['on', 'off'].includes(option)) {
      return sock.sendMessage(sender, {
        text:
`🤖 *ANTIBOT*

Status: *${enabled ? 'ON 🟢' : 'OFF 🔴'}*

Usage:
.antibot on
.antibot off`
      });
    }

    security.set(
      sender,
      'antibot',
      option === 'on'
    );

    await sock.sendMessage(sender, {
      text:
`🤖 *ANTIBOT*

Anti-bot protection has been turned *${option.toUpperCase()}*.

${option === 'on'
  ? '🛡️ Bot accounts will now be detected when they join.'
  : '🔓 Anti-bot protection is disabled.'}`
    });
  }
};
