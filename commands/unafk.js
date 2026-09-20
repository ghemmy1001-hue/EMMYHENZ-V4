const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '..',
  'data',
  'afk.json'
);

function loadAFK() {
  if (!fs.existsSync(file)) {
    return {};
  }

  try {
    return JSON.parse(
      fs.readFileSync(file, 'utf8')
    );
  } catch {
    return {};
  }
}

function saveAFK(data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  name: 'unafk',

  description: 'Remove yourself from AFK mode',

  async execute(sock, sender) {

    const afk = loadAFK();

    if (!afk[sender]) {
      await sock.sendMessage(sender, {
        text:
          'ℹ️ You are not currently marked as AFK.'
      });

      return;
    }

    const previous =
      afk[sender];

    delete afk[sender];

    saveAFK(afk);

    const duration =
      Date.now() -
      (previous.time || Date.now());

    const minutes =
      Math.floor(
        duration / 60000
      );

    await sock.sendMessage(sender, {
      text:
`👋 *WELCOME BACK!*

✅ Your AFK status has been removed.

📝 Previous reason:
${previous.reason || 'No reason given'}

⏱️ AFK duration: *${minutes} minute(s)*`
    });
  }
};
