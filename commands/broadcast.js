const g = require('../utils/group');

module.exports = {
  name: 'broadcast',
  description: 'Broadcast a message to group members',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await sock.groupMetadata(sender);

    const message = args.join(' ').trim();

    if (!message) {
      return sock.sendMessage(sender, {
        text: '📢 Usage: .broadcast your message'
      });
    }

    const mentions = (metadata.participants || [])
      .map(p => p.id || p.jid)
      .filter(Boolean);

    await sock.sendMessage(sender, {
      text:
`📢 *GROUP BROADCAST*

${message}

👥 Sent to ${mentions.length} group members.`,

      mentions
    });
  }
};
