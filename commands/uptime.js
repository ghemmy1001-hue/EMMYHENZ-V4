module.exports = {
  name: 'uptime',
  description: 'Show bot uptime',

  async execute(sock, sender) {
    const seconds = Math.floor(process.uptime());

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    await sock.sendMessage(sender, {
      text:
        `⏱️ *BOT UPTIME*\n\n` +
        `🟢 ${days}d ${hours}h ${minutes}m ${secs}s`
    });
  }
};
