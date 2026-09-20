module.exports = {
  name: 'membercount',
  description: 'Show group member count',
  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    const metadata = await sock.groupMetadata(sender);

    await sock.sendMessage(sender, {
      text:
`👥 *GROUP MEMBERS*

🏠 ${metadata.subject}
👤 Members: *${metadata.participants.length}*`
    });
  }
};
