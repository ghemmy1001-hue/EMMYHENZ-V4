const g = require('../utils/group');

module.exports = {
  name: 'setname',
  description: 'Change the group name',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const newName = args.join(' ').trim();

    if (!newName) {
      return sock.sendMessage(sender, {
        text: '❌ Usage: .setname New Group Name'
      });
    }

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    try {
      await sock.groupUpdateSubject(sender, newName);

      await sock.sendMessage(sender, {
        text: `✅ Group name changed to:\n*${newName}*`
      });
    } catch (error) {
      console.error('Setname error:', error.message);

      await sock.sendMessage(sender, {
        text: '❌ Failed to change the group name.'
      });
    }
  }
};
