const g = require('../utils/group');
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'welcome.json');

function load() {
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'welcome',
  description: 'Configure group welcome message',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const action = args[0]?.toLowerCase();
    const data = load();

    if (action === 'off') {
      delete data[sender];
      save(data);

      return sock.sendMessage(sender, {
        text: '👋 Welcome messages disabled.'
      });
    }

    if (!args.length) {
      const current = data[sender] || 'Not configured';

      return sock.sendMessage(sender, {
        text:
          `👋 *WELCOME SETTINGS*\n\n` +
          `Current message:\n${current}\n\n` +
          `Usage:\n` +
          `.welcome Welcome @user to the group!\n` +
          `.welcome off`
      });
    }

    const message = args.join(' ');

    data[sender] = message;
    save(data);

    await sock.sendMessage(sender, {
      text:
        `✅ Welcome message saved.\n\n` +
        `Message:\n${message}`
    });
  }
};
