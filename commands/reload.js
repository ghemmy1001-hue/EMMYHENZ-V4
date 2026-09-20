module.exports = {
  name: 'reload',
  description: 'Reload all bot commands',

  async execute(sock, sender, args, msg, context) {
    try {
      const loadCommands = require('../utils/commandLoader');

      const newCommands = loadCommands();

      if (!context.commands) {
        context.commands = newCommands;
      } else {
        context.commands.clear();

        for (const [name, command] of newCommands) {
          context.commands.set(name, command);
        }
      }

      await sock.sendMessage(sender, {
        text:
`╭━━〔 🔄 RELOAD 〕━━╮
┃
┃ ✅ Commands reloaded
┃ 📦 Commands: ${newCommands.size}
┃ 🟢 Status: ONLINE
┃
╰━━━━━━━━━━━━━━━━━━╯`
      });

    } catch (error) {
      console.error('Reload error:', error);

      await sock.sendMessage(sender, {
        text:
`❌ Reload failed

${error.message}`
      });
    }
  }
};
