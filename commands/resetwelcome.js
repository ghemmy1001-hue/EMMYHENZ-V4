const g = require('../utils/group');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'resetwelcome',
  description: 'Reset group welcome message',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const file = path.join(__dirname, '..', 'data', 'welcome.json');

    let data = {};

    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {}

    delete data[sender];

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    await sock.sendMessage(sender, {
      text: '👋 Welcome message reset.'
    });
  }
};
