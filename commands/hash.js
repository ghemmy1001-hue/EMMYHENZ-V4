const crypto = require('crypto');

module.exports = {
  name: 'hash',
  description: 'Generate a hash',

  async execute(sock, sender, args) {
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text:
          '🔐 *HASH*\n\n' +
          'Usage:\n' +
          '.hash hello world'
      });
    }

    const sha256 = crypto
      .createHash('sha256')
      .update(input)
      .digest('hex');

    await sock.sendMessage(sender, {
      text:
        `🔐 *SHA-256 HASH*\n\n` +
        `${sha256}`
    });
  }
};
