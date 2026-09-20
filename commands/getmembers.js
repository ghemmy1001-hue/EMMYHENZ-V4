module.exports = {
  name: 'getmembers',
  description: 'List all group members',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);
      const members = metadata.participants || [];

      const mentions = members.map(p => p.id);

      const list = members.map((p, i) => {
        const number = p.id.split('@')[0];
        const role = p.admin ? ' 👑' : '';
        return `${i + 1}. @${number}${role}`;
      }).join('\n');

      await sock.sendMessage(sender, {
        text:
`👥 *GROUP MEMBERS*

${list}

📊 Total: ${members.length}`,
        mentions
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
