const g = require('../utils/group');

module.exports = {
  name: 'groupidcopy',
  description: 'Show the current group ID',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    await sock.sendMessage(sender, {
      text:
`🆔 *GROUP ID*

\`${sender}\`

📋 Copy the ID above if you need it for bot configuration.`
    });
  }
};
