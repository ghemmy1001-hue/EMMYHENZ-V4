const g = require('../utils/group');

module.exports = {
  name: 'jid',
  description: 'Show the current chat JID',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: `🆔 *Chat JID:*\n${sender}`
    });
  }
};
