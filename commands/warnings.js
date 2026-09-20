const fs = require('fs');
const path = require('path');
const g = require('../utils/group');

const file = path.join(__dirname, '..', 'data', 'warnings.json');

function loadWarnings() {
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

module.exports = {
  name: 'warnings',
  description: 'Check member warnings',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: '⚠️ Reply to a member or mention them.'
      });
    }

    const warnings = loadWarnings();
    const key = `${sender}:${target}`;
    const count = warnings[key] || 0;

    await sock.sendMessage(sender, {
      text:
        `⚠️ *WARNING STATUS*\n\n` +
        `Member: @${target.split('@')[0]}\n` +
        `Warnings: *${count}*`,
      mentions: [target]
    });
  }
};
