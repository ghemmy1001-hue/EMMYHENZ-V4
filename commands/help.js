module.exports = {
  name: 'help',
  description: 'Show command help',

  async execute(sock, sender, args, msg, { commands, config }) {
    const commandName = args[0]?.toLowerCase();

    if (commandName) {
      const command = commands.get(commandName);

      if (!command) {
        return sock.sendMessage(sender, {
          text:
            `❌ Command not found: ${config.PREFIX}${commandName}\n\n` +
            `Use ${config.PREFIX}listcmd to see available commands.`
        });
      }

      return sock.sendMessage(sender, {
        text:
          `╔══════════════════╗\n` +
          `      🤖 *COMMAND HELP*\n` +
          `╠══════════════════╣\n` +
          `║ Command: *${config.PREFIX}${command.name}*\n` +
          `║\n` +
          `║ ${command.description || 'No description available.'}\n` +
          `╚══════════════════╝`
      });
    }

    await sock.sendMessage(sender, {
      text:
        `🤖 *EMMY BOT HELP*\n\n` +
        `Use *${config.PREFIX}help <command>* for information about a command.\n\n` +
        `Example:\n` +
        `${config.PREFIX}help kick\n` +
        `${config.PREFIX}help antilink\n` +
        `${config.PREFIX}help ai\n\n` +
        `📋 Use *${config.PREFIX}listcmd* to see all commands.`
    });
  }
};
