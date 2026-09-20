const crypto = require('crypto');

module.exports = {
  name: 'uuid',
  description: 'Generate a UUID',
  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: `🆔 UUID\n\n${crypto.randomUUID()}`
    });
  }
};
