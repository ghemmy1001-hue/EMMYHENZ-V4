const fs = require('fs');
const path = require('path');
const g = require('../utils/group');

const file = path.join(
  __dirname,
  '..',
  'data',
  'goodbye.json'
);

function load() {
  const dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

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

function save(data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  name: 'setgoodbye',
  description: 'Set group goodbye message',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const message = args.join(' ').trim();

    if (!message) {
      return sock.sendMessage(sender, {
        text:
          '👋 Usage:\n\n' +
          '.setgoodbye Goodbye @user!'
      });
    }

    const data = load();

    data[sender] = message;

    save(data);

    await sock.sendMessage(sender, {
      text:
        '✅ Goodbye message saved.\n\n' +
        `Preview:\n${message}`
    });
  }
};
