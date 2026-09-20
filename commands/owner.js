module.exports = {
  name: 'owner',
  description: 'Show bot owner information',

  async execute(sock, sender, args, msg, { config }) {
    const ownerName = config.OWNER_NAME || 'EmmyHenz';
    const ownerNumber = config.OWNER_NUMBER || '';

    const text =
      `╔══════════════════════════════╗\n` +
      `║       👑 *BOT OWNER* 👑       ║\n` +
      `╠══════════════════════════════╣\n` +
      `║ 👤 Name: *${ownerName}*\n` +
      `║ 📱 Number: *${ownerNumber || 'Not configured'}*\n` +
      `║ 🤖 Bot: *${config.BOT_NAME || 'EMMYHENZ-V4'}*\n` +
      `╚══════════════════════════════╝\n\n` +
      `❤️ Thanks for using the bot!`;

    await sock.sendMessage(sender, {
      text
    });
  }
};
