const g = require('../utils/group');

module.exports = {
  name: 'revoke',
  description: 'Reset the group invite link',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupRevokeInvite(sender);

      await sock.sendMessage(sender, {
        text: '✅ Group invite link has been reset.'
      });
    } catch (error) {
      console.error('Revoke error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to reset the invite link.'
      });
    }
  }
};
