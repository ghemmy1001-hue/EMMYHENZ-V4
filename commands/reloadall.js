const loadCommands = require('../utils/commandLoader');

module.exports = {
  name: 'reloadall',
  description: 'Reload all bot commands',

  async execute(sock, sender, args, msg, context) {
    try {
      const fresh = loadCommands();

      context.commands.clear();

      for (const [name, command] of fresh) {
        context.commands.set(name, command);
      }

      await sock.sendMessage(sender, {
        text:
`🔄 *FULL RELOAD COMPLETE*

📦 Commands: ${context.commands.size}
🟢 Bot remains online.`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Reload failed:\n${error.message}`
      });
    }
  }
};
