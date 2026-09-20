module.exports = {
  name: 'commandcount',
  description: 'Show total loaded commands',
  async execute(sock, sender, args, msg, { commands }) {
    await sock.sendMessage(sender, {
      text: `📦 *COMMAND COUNT*\n\n⚡ ${commands.size} commands loaded.`
    });
  }
};
