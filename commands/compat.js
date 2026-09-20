module.exports = {
  name: 'compat',
  description: 'Fun compatibility calculator',

  async execute(sock, sender, args, msg) {
    const context =
      msg.message?.extendedTextMessage?.contextInfo;

    const mentions =
      context?.mentionedJid || [];

    if (mentions.length < 2) {
      return sock.sendMessage(sender, {
        text: '❤️ Mention two people to check compatibility.'
      });
    }

    const score =
      Math.floor(Math.random() * 101);

    await sock.sendMessage(sender, {
      text:
`❤️ *COMPATIBILITY*

@${mentions[0].split('@')[0]} + @${mentions[1].split('@')[0]}

💞 Score: *${score}%*`,
      mentions
    });
  }
};
