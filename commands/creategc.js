module.exports = {
  name: 'creategc',
  description: 'Create a new WhatsApp group',

  async execute(sock, sender, args) {
    const name = args.join(' ').trim();

    if (!name) {
      return sock.sendMessage(sender, {
        text:
          '❌ *CREATEGROUP*\n\n' +
          'Usage:\n' +
          '.creategc Group Name\n\n' +
          'Example:\n' +
          '.creategc DEV-X FAMILY'
      });
    }

    if (name.length > 100) {
      return sock.sendMessage(sender, {
        text: '❌ Group name is too long.'
      });
    }

    try {
      const result = await sock.groupCreate(name, []);

      const groupJid = result.id;

      let invite = '';

      try {
        invite = await sock.groupInviteCode(groupJid);
      } catch {
        invite = null;
      }

      let response =
        `╔══════════════════════╗\n` +
        `║   🚀 GROUP CREATED   ║\n` +
        `╚══════════════════════╝\n\n` +
        `👥 Name: *${name}*\n` +
        `🆔 JID: ${groupJid}\n`;

      if (invite) {
        response +=
          `\n🔗 Invite:\n` +
          `https://chat.whatsapp.com/${invite}\n`;
      }

      response +=
        `\n✅ DEV-X created the group successfully.`;

      await sock.sendMessage(sender, {
        text: response
      });

    } catch (error) {
      console.log(
        '❌ Create group error:',
        error.message
      );

      await sock.sendMessage(sender, {
        text:
          `❌ Failed to create the group.\n\n` +
          `Reason: ${error.message}`
      });
    }
  }
};
