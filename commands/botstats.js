module.exports = {
  name: 'botstats',
  description: 'Show bot statistics',
  async execute(sock, sender, args, msg, { commands, config }) {
    await sock.sendMessage(sender, {
      text:
`📊 *BOT STATISTICS*

🤖 ${config.BOT_NAME || 'EMMYHENZ-V4'}
⚡ Version: ${config.VERSION || '4.0.0'}
⌨️ Prefix: ${config.PREFIX || '.'}
📦 Commands: ${commands.size}
🟢 Status: ONLINE`
    });
  }
};
