module.exports = {
  name: 'info',
  description: 'Show bot information',

  async execute(sock, sender, args, msg, { config, commands }) {
    await sock.sendMessage(sender, {
      text:
        `╔══════════════════════╗\n` +
        `║ 🤖 *EMMYHENZ-V4 INFO*\n` +
        `╠══════════════════════╣\n` +
        `║ 👑 Owner: *${config.OWNER_NAME || 'EmmyHenz'}*\n` +
        `║ ⚡ Version: *${config.VERSION || '4.0.0'}*\n` +
        `║ ⌨️ Prefix: *${config.PREFIX || '.'}*\n` +
        `║ 📦 Commands: *${commands.size}*\n` +
        `║ 🟢 Status: *Online*\n` +
        `╚══════════════════════╝`
    });
  }
};
