module.exports = {
  name: 'rate',
  description: 'Give a random fun rating',
  async execute(sock, sender, args) {
    const thing = args.join(' ') || 'you';
    const rating = Math.floor(Math.random() * 101);

    await sock.sendMessage(sender, {
      text: `⭐ Rating\n\n${thing}: ${rating}/100`
    });
  }
};
