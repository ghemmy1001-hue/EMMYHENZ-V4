module.exports = {
  name: 'timestamp',
  description: 'Show current Unix timestamp',

  async execute(sock, sender) {
    const unix = Math.floor(
      Date.now() / 1000
    );

    const date = new Date()
      .toISOString();

    await sock.sendMessage(sender, {
      text:
        `⏱️ *TIMESTAMP*\n\n` +
        `Unix: *${unix}*\n` +
        `UTC: *${date}*`
    });
  }
};
