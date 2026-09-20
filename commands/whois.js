module.exports = {
  name: 'whois',
  description: 'Show information about a mentioned or quoted user',

  async execute(sock, sender, args, msg) {
    const context =
      msg.message?.extendedTextMessage?.contextInfo;

    const mentioned = context?.mentionedJid?.[0];
    const quoted = context?.participant;

    const target = mentioned || quoted;

    if (!target) {
      return sock.sendMessage(sender, {
        text:
          `❌ Mention or reply to a user.\n\n` +
          `Example: .whois @user`
      });
    }

    await sock.sendMessage(sender, {
      text:
        `👤 *USER INFO*\n\n` +
        `📱 JID: \`${target}\`\n` +
        `🔢 Number: *${target.split('@')[0]}*`,
      mentions: [target]
    });
  }
};
