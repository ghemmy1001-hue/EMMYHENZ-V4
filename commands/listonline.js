module.exports = {
  name: 'listonline',
  description: 'List chats recently seen by the bot',

  async execute(sock, sender, args, msg) {
    try {
      const chats = global.onlineChats
        ? Array.from(global.onlineChats)
        : [];

      if (!chats.length) {
        return sock.sendMessage(sender, {
          text: '📡 No recently active chats found.'
        });
      }

      const list = chats.map((jid, i) => {
        const type = jid.endsWith('@g.us')
          ? '👥 Group'
          : jid.endsWith('@newsletter')
            ? '📢 Channel'
            : '👤 Private';

        return `${i + 1}. ${type}\n   ${jid}`;
      }).join('\n\n');

      await sock.sendMessage(sender, {
        text:
`📡 *RECENTLY ACTIVE CHATS*

${list}

📊 Total: ${chats.length}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ listonline failed:\n${error.message}`
      });
    }
  }
};
