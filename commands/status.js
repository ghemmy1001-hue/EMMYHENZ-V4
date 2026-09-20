module.exports = {
  name: 'status',
  description: 'Show bot status',
  async execute(sock, sender, args, msg, { config, commands }) {
    const used = process.memoryUsage();
    const uptime = Math.floor(process.uptime());

    await sock.sendMessage(sender, {
      text: `╭━━〔 📊 BOT STATUS 〕━━╮
┃
┃ 🤖 ${config.BOT_NAME || 'EMMYHENZ'}
┃ 🟢 Status: ONLINE
┃ 📦 Commands: ${commands.size}
┃ ⏱️ Uptime: ${uptime}s
┃ 💾 RAM: ${Math.round(used.rss / 1024 / 1024)} MB
┃ 🟢 Node: ${process.version}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
    });
  }
};
