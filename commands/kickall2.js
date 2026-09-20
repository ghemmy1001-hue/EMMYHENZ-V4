module.exports = {
  name: 'kickall2',
  description: 'Remove all non-admin members from the group',

  async execute(sock, sender, args, msg) {
    if (!sender.endsWith('@g.us')) {
      return sock.sendMessage(sender, {
        text: '❌ This command only works in groups.'
      });
    }

    try {
      const metadata = await sock.groupMetadata(sender);

      const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';

      const targets = metadata.participants
        .filter(p =>
          !p.admin &&
          p.id !== botJid &&
          p.id !== sock.user?.id
        )
        .map(p => p.id);

      if (!targets.length) {
        return sock.sendMessage(sender, {
          text: 'ℹ️ There are no removable members.'
        });
      }

      await sock.groupParticipantsUpdate(
        sender,
        targets,
        'remove'
      );

      await sock.sendMessage(sender, {
        text: `✅ Removed ${targets.length} member(s).`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Failed:\n${error.message}`
      });
    }
  }
};
