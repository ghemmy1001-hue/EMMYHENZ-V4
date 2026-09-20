module.exports = {
  name: 'removeuser',
  description: 'Remove a member from the group',

  async execute(sock, sender, args, msg) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    let jid = msg?.message?.extendedTextMessage
      ?.contextInfo?.participant;

    if (!jid) {
      const number = args.join('').replace(/\D/g, '');

      if (number) {
        jid = `${number}@s.whatsapp.net`;
      }
    }

    if (!jid) {
      return sock.sendMessage(sender, {
        text: '📱 Reply to a member or use:\n.removeuser 2348012345678'
      });
    }

    try {
      await sock.groupParticipantsUpdate(
        sender,
        [jid],
        'remove'
      );

      await sock.sendMessage(sender, {
        text: '✅ Member removed.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
