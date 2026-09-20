module.exports = {
  name: 'getjid',
  description: 'Show the current chat JID',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`🆔 *CHAT JID*

${sender}`
    });
  }
};
