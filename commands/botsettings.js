module.exports = {
  name: 'botsettings',
  description: 'Show current bot settings',

  async execute(sock, sender, args, msg, { config, commands }) {
    const text =
`⚙️ *BOT SETTINGS*

🤖 Name: ${config.BOT_NAME || 'Unknown'}
⚡ Version: ${config.VERSION || 'Unknown'}
⌨️ Prefix: ${config.PREFIX || '.'}
📦 Commands: ${commands?.size || 0}
🟢 Status: ONLINE`;

    await sock.sendMessage(sender, { text });
  }
};
