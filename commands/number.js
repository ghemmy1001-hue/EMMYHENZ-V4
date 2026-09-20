module.exports = {
  name: 'number',
  description: 'Show your WhatsApp number',

  async execute(sock, sender, args, msg) {
    const jid = msg.key.participant || msg.key.remoteJid;

    const number = jid.split('@')[0].split(':')[0];

    await sock.sendMessage(sender, {
      text:
        `📱 *YOUR NUMBER*\n\n` +
        `+${number}`
    });
  }
};
