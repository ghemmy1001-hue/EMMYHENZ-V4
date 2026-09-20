module.exports = {
  name: 'timestamp2',
  description: 'Generate a Unix timestamp',

  async execute(sock, sender) {
    const now =
      Math.floor(Date.now() / 1000);

    await sock.sendMessage(sender, {
      text:
`⏱️ *TIMESTAMP*

Unix timestamp:

\`${now}\`

🕐 ${new Date().toISOString()}`
    });
  }
};
