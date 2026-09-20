module.exports = {
  name: 'profile',
  description: 'Show bot profile information',

  async execute(sock, sender, args, msg, { config }) {
    const name = config.BOT_NAME || 'EMMYHENZ-V4';
    const owner = config.OWNER_NAME || 'EmmyHenz';

    await sock.sendMessage(sender, {
      text:
        `╔══════════════════════╗\n` +
        `║ 👤 *BOT PROFILE*\n` +
        `╠══════════════════════╣\n` +
        `║ 🤖 Name: *${name}*\n` +
        `║ 👑 Owner: *${owner}*\n` +
        `║ ⚡ Version: *${config.VERSION || '4.0.0'}*\n` +
        `║ ⌨️ Prefix: *${config.PREFIX || '.'}*\n` +
        `╚══════════════════════╝`
    });
  }
};
