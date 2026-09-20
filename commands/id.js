module.exports = {
  name: 'id',
  description: 'Show your WhatsApp ID',

  async execute(sock, sender, args, msg) {
    const jid = msg.key.participant || msg.key.remoteJid;

    await sock.sendMessage(sender, {
      text:
        `🆔 *YOUR WHATSAPP ID*\n\n` +
        `\`${jid}\``
    });
  }
};
