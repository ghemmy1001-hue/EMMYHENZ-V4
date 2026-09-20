const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setprefix',
  description: 'Change the bot command prefix',

  async execute(sock, sender, args, msg, { config }) {
    const newPrefix = args[0];

    if (!newPrefix || newPrefix.length > 3) {
      return sock.sendMessage(sender, {
        text: '❌ Usage:\n.setprefix !'
      });
    }

    config.PREFIX = newPrefix;

    try {
      const configPath = path.join(__dirname, '..', 'config.js');
      let source = fs.readFileSync(configPath, 'utf8');

      source = source.replace(
        /PREFIX\s*:\s*['"`][^'"`]*['"`]/,
        `PREFIX: '${newPrefix}'`
      );

      fs.writeFileSync(configPath, source);

      await sock.sendMessage(sender, {
        text:
`✅ Prefix changed successfully.

New prefix: ${newPrefix}

Example:
${newPrefix}menu`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
`⚠️ Prefix changed in memory, but could not save it.

${error.message}`
      });
    }
  }
};
