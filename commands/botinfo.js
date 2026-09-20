module.exports = {
  name: 'botinfo',
  description: 'Show detailed bot information',

  async execute(sock, sender, args, msg, { config, commands }) {
    const uptime = formatUptime(process.uptime());

    const text =
      `╔══════════════════════════════╗\n` +
      `║      ❄️🌹 *EMMYHENZ-V4* 🌹❄️      ║\n` +
      `╠══════════════════════════════╣\n` +
      `║ 🤖 Bot: *${config.BOT_NAME || 'EMMYHENZ-V4'}*\n` +
      `║ 👑 Owner: *${config.OWNER_NAME || 'EmmyHenz'}*\n` +
      `║ ⚡ Version: *${config.VERSION || '4.0.0'}*\n` +
      `║ ⌨️ Prefix: *${config.PREFIX || '.'}*\n` +
      `║ 📦 Commands: *${commands.size}*\n` +
      `║ ⏱️ Uptime: *${uptime}*\n` +
      `║ 🟢 Status: *ONLINE*\n` +
      `║ 📱 Platform: *WhatsApp Multi-Device*\n` +
      `╚══════════════════════════════╝\n\n` +
      `❤️ *EMMYHENZ TECH*\n` +
      `🚀 Built for speed, fun & automation.`;

    await sock.sendMessage(sender, {
      text
    });
  }
};

function formatUptime(seconds) {
  seconds = Math.floor(seconds);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);

  parts.push(`${secs}s`);

  return parts.join(' ');
}
