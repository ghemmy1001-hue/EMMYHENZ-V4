module.exports = {
  name: 'statusdel',
  description: 'Status deletion information',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`🗑️ *STATUS DELETE*

Status deletion is controlled by WhatsApp's status system.

Open WhatsApp → Updates → My Status → select the status → Delete.`
    });
  }
};
