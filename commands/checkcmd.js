module.exports = {
  name: 'checkcmd',
  description: 'Check whether a command exists',
  async execute(sock, sender, args, msg, { commands, config }) {
    const name = (args[0] || '').replace(config.PREFIX, '').toLowerCase();

    if (!name) {
      return sock.sendMessage(sender, {
        text: `🔎 Use: ${config.PREFIX}checkcmd <command>`
      });
    }

    const exists = commands.has(name);

    await sock.sendMessage(sender, {
      text:
`🔎 *COMMAND CHECK*

${config.PREFIX}${name}

${exists ? '✅ Command exists.' : '❌ Command not found.'}`
    });
  }
};
