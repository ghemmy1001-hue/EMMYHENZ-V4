module.exports = {
  name: 'banall',
  description: 'Remove all non-admin members from the group',

  async execute(sock, sender) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ Group command only.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);

      const targets = metadata.participants
        .filter(p => !p.admin)
        .map(p => p.id);

      if (!targets.length) {
        return sock.sendMessage(sender, {
          text: 'ℹ️ No non-admin members found.'
        });
      }

      await sock.groupParticipantsUpdate(
        sender,
        targets,
        'remove'
      );

      await sock.sendMessage(sender, {
        text: `🚫 Removed ${targets.length} non-admin member(s).`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
