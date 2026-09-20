module.exports = {
  name: 'groupid',
  description: 'Show the current group ID',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    await sock.sendMessage(sender, {
      text: `🆔 *GROUP ID*\n\n\`${sender}\``
    });
  }
};
