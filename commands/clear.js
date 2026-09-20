const g = require('../utils/group');

module.exports = {
  name: 'clear',
  description: 'Delete a quoted message',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.stanzaId;

    if (!quoted) {
      return sock.sendMessage(sender, {
        text: '🗑️ Reply to the message you want me to delete.'
      });
    }

    const participant =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    try {
      await sock.sendMessage(sender, {
        delete: {
          remoteJid: sender,
          fromMe: false,
          id: quoted,
          participant
        }
      });

      await sock.sendMessage(sender, {
        text: '🗑️ Message deleted.'
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not delete message.\n\n${error.message}`
      });
    }
  }
};
