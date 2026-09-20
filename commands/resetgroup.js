const fs = require('fs');
const path = require('path');
const g = require('../utils/group');

module.exports = {
  name: 'resetgroup',
  description: 'Reset bot settings for this group',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const files = [
      'security.json',
      'welcome.json',
      'goodbye.json'
    ];

    let changed = 0;

    for (const filename of files) {
      const file = path.join(
        __dirname,
        '..',
        'data',
        filename
      );

      if (!fs.existsSync(file)) continue;

      try {
        const data =
          JSON.parse(
            fs.readFileSync(file, 'utf8')
          );

        let modified = false;

        for (const category of Object.keys(data)) {
          if (
            data[category] &&
            typeof data[category] === 'object' &&
            !Array.isArray(data[category])
          ) {
            if (
              Object.prototype.hasOwnProperty.call(
                data[category],
                sender
              )
            ) {
              delete data[category][sender];
              modified = true;
            }
          }
        }

        if (
          filename === 'welcome.json' ||
          filename === 'goodbye.json'
        ) {
          if (
            Object.prototype.hasOwnProperty.call(
              data,
              sender
            )
          ) {
            delete data[sender];
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(
            file,
            JSON.stringify(data, null, 2)
          );

          changed++;
        }
      } catch {}
    }

    await sock.sendMessage(sender, {
      text:
        changed
          ? '♻️ Group bot settings have been reset.'
          : 'ℹ️ No saved group settings were found.'
    });
  }
};
