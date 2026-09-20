module.exports = {
  name: 'server',
  description: 'Show server information',

  async execute(sock, sender) {
    const os = require('os');

    await sock.sendMessage(sender, {
      text:
        `🖥️ *SERVER INFO*\n\n` +
        `💻 OS: *${os.platform()}*\n` +
        `🏗️ Arch: *${os.arch()}*\n` +
        `🧠 CPU: *${os.cpus().length} cores*\n` +
        `📦 Node: *${process.version}*`
    });
  }
};
