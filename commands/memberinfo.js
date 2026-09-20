const g = require('../utils/group');

module.exports = {
  name: 'memberinfo',
  description: 'Show information about a group member',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    try {
      const metadata =
        await sock.groupMetadata(sender);

      const context =
        msg?.message?.extendedTextMessage?.contextInfo ||
        msg?.message?.imageMessage?.contextInfo ||
        msg?.message?.videoMessage?.contextInfo ||
        {};

      let target =
        context.participant ||
        context.mentionedJid?.[0];

      if (!target && args.length) {
        const number =
          args.join('').replace(/\D/g, '');

        if (number) {
          target =
            `${number}@s.whatsapp.net`;
        }
      }

      if (!target) {
        return sock.sendMessage(sender, {
          text:
`👤 *MEMBER INFO*

Reply to a member's message or mention them.

Example:
.memberinfo @user`
        });
      }

      const participant =
        (metadata.participants || []).find(
          member =>
            (member.id || member.jid) === target
        );

      if (!participant) {
        return sock.sendMessage(sender, {
          text:
            '❌ That user is not currently in this group.'
        });
      }

      const jid =
        participant.id ||
        participant.jid ||
        target;

      let role = 'Member';

      if (participant.admin === 'admin') {
        role = 'Admin';
      }

      if (participant.admin === 'superadmin') {
        role = 'Group Creator';
      }

      await sock.sendMessage(sender, {
        text:
`👤 *MEMBER INFORMATION*

📱 Number: @${jid.split('@')[0]}

🛡️ Role: *${role}*

🏷️ Group: *${metadata.subject}*`,

        mentions: [jid]
      });

    } catch (error) {
      console.log('❌ memberinfo error:', error.message);
      await sock.sendMessage(sender, {
        text: '❌ Unable to get member information.'
      });
    }
  }
};
