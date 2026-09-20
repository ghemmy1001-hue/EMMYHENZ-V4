const g = require('../utils/group');

module.exports = {
  name: 'setdesc',
  description: 'Change the group description',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const description = args.join(' ').trim();

    if (!description) {
      return sock.sendMessage(sender, {
        text: '❌ Usage: .setdesc New group description'
      });
    }

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupUpdateDescription(sender, description);

      await sock.sendMessage(sender, {
        text: '✅ Group description updated.'
      });
    } catch (error) {
      console.error('Setdesc error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to change the group description.'
      });
    }
  }
};
