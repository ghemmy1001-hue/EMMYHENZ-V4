module.exports = {
  name: 'getadmins',
  description: 'Show the group administrators',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);

      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

      if (!admins.length) {
        return sock.sendMessage(sender, {
          text: 'ℹ️ No admins found.'
        });
      }

      const mentions = admins;

      const list = admins
        .map((jid, i) => {
          const number = jid.split('@')[0];
          return `${i + 1}. @${number}`;
        })
        .join('\n');

      await sock.sendMessage(sender, {
        text:
`👑 *GROUP ADMINS*

${list}

👥 Total: ${admins.length}`,
        mentions
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
