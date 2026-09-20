cat > commands/ban.js <<'EOF'
const g = require('../utils/group');

module.exports = {
  name: 'ban',
  description: 'Remove a member from the group',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: 'Usage: .ban @user or reply to their message.'
      });
    }

    await sock.groupParticipantsUpdate(sender, [target], 'remove');

    await sock.sendMessage(sender, {
      text: '✅ Member removed from the group.'
    });
  }
};
EOF
