module.exports = {
  name: 'source',
  description: 'Show bot source information',
  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`💻 *BOT SOURCE*

🤖 EMMYHENZ-V4
⚡ Node.js + Baileys
📱 WhatsApp Multi-Device

🔐 Source information is available from the bot owner.`
    });
  }
};
