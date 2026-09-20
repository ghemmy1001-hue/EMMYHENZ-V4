module.exports = {
  name: 'node',
  description: 'Show Node.js version',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: `🟢 *NODE.JS*\n\nVersion: *${process.version}*`
    });
  }
};
