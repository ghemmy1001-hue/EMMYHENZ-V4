module.exports = {
  name: 'mention',
  description: 'Mention a user',

  async execute(sock, sender, args, msg) {
    const context =
      msg.message?.extendedTextMessage?.contextInfo;

    const target =
      context?.mentionedJid?.[0] ||
      context?.participant;

    if (!target) {
      return sock.sendMessage(sender, {
        text: '👤 Reply to a user or mention someone.'
      });
    }

    const message =
      args.join(' ').trim() ||
      `👋 Hello @${target.split('@')[0]}!`;

    await sock.sendMessage(sender, {
      text: message,
      mentions: [target]
    });
  }
};
