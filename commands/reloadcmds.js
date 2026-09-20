const loadCommands = require('../utils/commandLoader');

module.exports = {
  name: 'reloadcmds',
  description: 'Reload bot commands',

  async execute(sock, sender, args, msg, context) {
    try {
      const fresh = loadCommands();

      context.commands.clear();

      for (const [name, command] of fresh) {
        context.commands.set(name, command);
      }

      await sock.sendMessage(sender, {
        text:
`♻️ *COMMANDS RELOADED*

📦 Commands loaded: ${context.commands.size}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Reload failed:\n${error.message}`
      });
    }
  }
};
