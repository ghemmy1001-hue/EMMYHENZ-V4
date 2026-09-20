const crypto = require('crypto');

module.exports = {
  name: 'password',
  description: 'Generate a secure random password',
  async execute(sock, sender, args) {
    const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
    const password = crypto.randomBytes(length)
      .toString('base64')
      .replace(/[^A-Za-z0-9!@#$%^&*]/g, '')
      .slice(0, length);

    await sock.sendMessage(sender, {
      text: `🔐 Password (${length} characters)\n\n${password}`
    });
  }
};
