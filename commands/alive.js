module.exports = {
  name: 'alive',
  description: 'Check if the bot is online',

  async execute(sock, sender, args, msg, { config, commands }) {
    const uptime = formatUptime(process.uptime());

    const text =
      `╔══════════════════════════════╗\n` +
      `║       ❄️🌹 *EMMYHENZ-V4* 🌹❄️\n` +
      `╠══════════════════════════════╣\n` +
      `║ 🟢 Status: *ONLINE*\n` +
      `║ 🤖 Bot: *${config.BOT_NAME || 'EMMYHENZ-V4'}*\n` +
      `║ ⚡ Version: *${config.VERSION || '4.0.0'}*\n` +
      `║ 📦 Commands: *${commands.size}*\n` +
      `║ ⏱️ Uptime: *${uptime}*\n` +
      `╚══════════════════════════════╝\n\n` +
      `❤️ Bot is alive and ready!`;

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
