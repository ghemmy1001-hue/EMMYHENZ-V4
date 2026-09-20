const g = require('../utils/group');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'rules',
  description: 'Show group rules',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const file = path.join(__dirname, '..', 'data', 'rules.json');

    let rules = '';

    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      rules = data[sender] || '';
    } catch {}

    if (!rules) {
      return sock.sendMessage(sender, {
        text: '📜 No group rules have been set.\n\nAdmin can use:\n.rules <text>'
      });
    }

    await sock.sendMessage(sender, {
      text: `📜 *GROUP RULES*\n\n${rules}`
    });
  }
};
