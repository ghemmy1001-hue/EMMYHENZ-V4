module.exports = {
  name: 'adduser',
  description: 'Add a WhatsApp number to the group',

  async execute(sock, sender, args) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    const number = args.join('').replace(/\D/g, '');

    if (!number) {
      return sock.sendMessage(sender, {
        text: '📱 Usage:\n.adduser 2348012345678'
      });
    }

    const jid = `${number}@s.whatsapp.net`;

    try {
      await sock.groupParticipantsUpdate(
        sender,
        [jid],
        'add'
      );

      await sock.sendMessage(sender, {
        text: `✅ Add request sent for +${number}.`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
