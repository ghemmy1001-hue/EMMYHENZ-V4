module.exports = {
  name: 'botcommands',
  description: 'Show the total number of loaded commands',

  async execute(sock, sender, args, msg, { commands }) {
    const count =
      commands?.size || 0;

    await sock.sendMessage(sender, {
      text:
`🤖 *BOT COMMANDS*

📦 Loaded commands: *${count}*

⚡ Use *.menu* to view the available commands.`
    });
  }
};
