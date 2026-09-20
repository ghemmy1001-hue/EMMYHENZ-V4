module.exports = {
  name: 'runtime',
  description: 'Show bot uptime',

  async execute(sock, sender) {
    const seconds = Math.floor(process.uptime());

    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const uptime = [
      d ? `${d}d` : '',
      h ? `${h}h` : '',
      m ? `${m}m` : '',
      `${s}s`
    ].filter(Boolean).join(' ');

    await sock.sendMessage(sender, {
      text: `╔════════════════════╗
║ ⏱️ *BOT RUNTIME*
╠════════════════════╣
║ 🟢 Online: *${uptime}*
╚════════════════════╝`
    });
  }
};
