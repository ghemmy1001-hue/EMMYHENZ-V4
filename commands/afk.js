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
  name: 'afk',
  description: 'Set yourself as AFK',

  async execute(sock, sender, args, msg) {

    const afk = loadAFK();

    const reason =
      args.length > 0
        ? args.join(' ')
        : 'No reason given';

    afk[sender] = {
      reason,
      time: Date.now()
    };

    saveAFK(afk);

    await sock.sendMessage(
      sender,
      {
        text:
`💤 *AFK MODE*

You are now marked as AFK.

📝 Reason: ${reason}

Use *.unafk* when you return.`
      }
    );
  }
};
