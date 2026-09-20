module.exports = {
  name: 'leaderboard',
  description: 'Show group leaderboard',
  async execute(sock, sender) {
    const group = sender.endsWith('@g.us');

    if (!group) {
      return sock.sendMessage(sender, {
        text: '❌ This command is for groups only.'
      });
    }

    const metadata = await sock.groupMetadata(sender);
    const members = metadata.participants || [];

    const lines = members
      .slice(0, 10)
      .map((p, i) =>
        `${i + 1}. @${p.id.split('@')[0]}`
      );

    await sock.sendMessage(sender, {
      text:
`🏆 *GROUP LEADERBOARD*

${lines.join('\n')}

ℹ️ Activity tracking can be connected later.`,
      mentions: members.slice(0, 10).map(p => p.id)
    });
  }
};
