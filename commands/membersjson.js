const g = require('../utils/group');

module.exports = {
  name: 'membersjson',
  description: 'Export the group member list as JSON',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata = await sock.groupMetadata(sender);

      const members =
        (metadata.participants || []).map(
          (member, index) => ({
            number: index + 1,
            jid: member.id || member.jid || null,
            admin: member.admin || null
          })
        );

      const data = {
        group: metadata.subject,
        groupJid: sender,
        totalMembers: members.length,
        members
      };

      const json =
        JSON.stringify(
          data,
          null,
          2
        );

      await sock.sendMessage(sender, {
        document: Buffer.from(json, 'utf8'),
        mimetype: 'application/json',
        fileName: 'members.json',
        caption:
          `📦 *GROUP MEMBERS EXPORT*\n\n` +
          `👥 Members: *${members.length}*`
      });

    } catch (error) {
      console.log('❌ membersjson error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to create the members file.'
      });
    }
  }
};
