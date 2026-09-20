module.exports = {
  name: 'approveall',
  description: 'Approve all pending group join requests',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const requests = await sock.groupRequestParticipantsList(sender);

      if (!requests || !requests.length) {
        return sock.sendMessage(sender, {
          text: 'ℹ️ No pending join requests.'
        });
      }

      const ids = requests.map(r => r.jid);

      await sock.groupRequestParticipantsUpdate(
        sender,
        ids,
        'approve'
      );

      await sock.sendMessage(sender, {
        text: `✅ Approved ${ids.length} join request(s).`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
