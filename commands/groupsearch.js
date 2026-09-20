const g = require('../utils/group');

module.exports = {
  name: 'groupsearch',
  description: 'Search group members by number',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const query =
      args.join('').replace(/\D/g, '');

    if (!query) {
      return sock.sendMessage(sender, {
        text:
          '🔎 Usage: .groupsearch <phone number>'
      });
    }

    const metadata =
      await sock.groupMetadata(sender);

    const results =
      (metadata.participants || [])
        .map(p => p.id || p.jid)
        .filter(Boolean)
        .filter(jid =>
          jid.split('@')[0].includes(query)
        );

    if (!results.length) {
      return sock.sendMessage(sender, {
        text:
          `❌ No group member matched *${query}*.`
      });
    }

    const lines =
      results.map(
        (jid, i) =>
          `${i + 1}. @${jid.split('@')[0]}`
      ).join('\n');

    await sock.sendMessage(sender, {
      text:
`🔎 *SEARCH RESULTS*

${lines}

👥 Found: *${results.length}*`,

      mentions: results
    });
  }
};
