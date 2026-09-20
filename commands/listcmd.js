module.exports = {
  name: 'listcmd',
  description: 'List all loaded commands',

  async execute(sock, sender, args, msg, { commands, config }) {
    const list = [...commands.keys()]
      .sort()
      .map((cmd, i) => `${i + 1}. ${config.PREFIX}${cmd}`)
      .join('\n');

    await sock.sendMessage(sender, {
      text:
        `╔════════════════════╗\n` +
        `     🤖 *EMMY BOT COMMANDS*\n` +
        `╠════════════════════╣\n` +
        `║ Total: *${commands.size}*\n` +
        `╠════════════════════╣\n` +
        `${list}\n` +
        `╚════════════════════╝`
    });
  }
};
