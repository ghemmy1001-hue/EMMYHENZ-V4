const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'saveconfig',
  description: 'Save current bot configuration',

  async execute(sock, sender, args, msg, { config }) {
    try {
      const configPath = path.join(__dirname, '..', 'config.js');

      let source = fs.readFileSync(configPath, 'utf8');

      if (config.PREFIX) {
        source = source.replace(
          /PREFIX\s*:\s*['"`][^'"`]*['"`]/,
          `PREFIX: '${config.PREFIX}'`
        );
      }

      if (config.BOT_NAME) {
        source = source.replace(
          /BOT_NAME\s*:\s*['"`][^'"`]*['"`]/,
          `BOT_NAME: '${config.BOT_NAME}'`
        );
      }

      fs.writeFileSync(configPath, source);

      await sock.sendMessage(sender, {
        text: '💾 Configuration saved successfully.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not save configuration:\n${error.message}`
      });
    }
  }
};
