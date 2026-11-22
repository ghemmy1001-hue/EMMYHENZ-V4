const g = require('../utils/group');
const security = require('../utils/security');

module.exports = {
  name: 'antispam',
  description: 'Enable or disable automatic anti-spam protection',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.getGroupData(sock, sender);
    const actorJid = msg?.key?.participant || msg?.key?.remoteJid;

    if (!g.userIsAdmin(metadata, actorJid)) {
      return sock.sendMessage(sender, {
        text: '❌ Only group admins can change anti-spam settings.'
      });
    }

    const action = (args[0] || 'status').toLowerCase();
    const status = security.get(sender, 'antispam');

    if (action === 'status') {
      return sock.sendMessage(sender, {
        text: `🛡️ Anti-spam is currently *${status ? 'ON' : 'OFF'}*.\n\nUsage:\n.antispam on\n.antispam off\n.antispam status`
      });
    }

    if (!['on', 'off'].includes(action)) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid option. Use .antispam on, off, or status.'
      });
    }

    const enabled = action === 'on';
    security.set(sender, 'antispam', enabled);

    return sock.sendMessage(sender, {
      text: `🛡️ Anti-spam has been turned *${enabled ? 'ON' : 'OFF'}*.`
    });
  }
};
