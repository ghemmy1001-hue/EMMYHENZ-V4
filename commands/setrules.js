const g = require('../utils/group');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setrules',
  description: 'Set group rules',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    if (!args.length) {
      return sock.sendMessage(sender, {
        text: '⚠️ Usage: .setrules <group rules>'
      });
    }

    const dir = path.join(__dirname, '..', 'data');

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = path.join(dir, 'rules.json');

    let data = {};

    try {
      if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file, 'utf8'));
      }
    } catch {
      data = {};
    }

    data[sender] = args.join(' ');

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    await sock.sendMessage(sender, {
      text: '📜 Group rules updated successfully.'
    });
  }
};
