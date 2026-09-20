module.exports = {
  name: 'rate2',
  description: 'Rate something',

  async execute(sock, sender, args) {
    const thing = args.join(' ').trim();

    if (!thing) {
      return sock.sendMessage(sender, {
        text: '⭐ Example: .rate2 my coding skills'
      });
    }

    const score =
      Math.floor(Math.random() * 101);

    await sock.sendMessage(sender, {
      text: `⭐ *RATING*\n\n${thing}\n\nScore: *${score}/100*`
    });
  }
};
