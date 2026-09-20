module.exports = {
  name: 'cmdinfo',
  description: 'Show information about a command',
  async execute(sock, sender, args, msg, { commands, config }) {
    const name = (args[0] || '').replace(config.PREFIX, '').toLowerCase();
    const command = commands.get(name);

    if (!command) {
      return sock.sendMessage(sender, {
        text: `❌ Command not found: ${config.PREFIX}${name || '...' }`
      });
    }

    await sock.sendMessage(sender, {
      text:
`📖 *COMMAND INFO*

⚡ Command: *${config.PREFIX}${command.name}*
📝 Description:
${command.description || 'No description available'}`
    });
  }
};
