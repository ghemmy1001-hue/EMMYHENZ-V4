const g = require('../utils/group');

module.exports = {
  name: 'announce',
  description: 'Send an announcement to a group',
  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata =
      await g.requireBotAdmin(sock, sender);

    if (!metadata) return;

    const message = args.join(' ').trim();

    if (!message) {
      return sock.sendMessage(sender, {
        text: '📢 Usage: .announce <message>'
      });
    }

    await sock.sendMessage(sender, {
      text:
`📢 *GROUP ANNOUNCEMENT*

${message}`
    });
  }
};
