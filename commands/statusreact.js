module.exports = {
  name: 'statusreact',
  description: 'Status reaction helper',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`❤️ *STATUS REACTION*

Use WhatsApp's normal status reaction feature to react to a status.

This command currently serves as a status-reaction helper.`
    });
  }
};
