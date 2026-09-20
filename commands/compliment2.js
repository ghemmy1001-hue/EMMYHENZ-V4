module.exports = {
  name: 'compliment2',
  description: 'Give a random compliment',
  async execute(sock, sender, args) {
    const target = args.join(' ').trim() || 'you';

    const compliments = [
      'You have great energy! 🔥',
      'You are doing better than you think. 💯',
      'Your creativity is impressive! 🎨',
      'You have a strong mindset. 🧠',
      'Keep being awesome! 👑'
    ];

    const compliment =
      compliments[Math.floor(Math.random() * compliments.length)];

    await sock.sendMessage(sender, {
      text: `✨ *COMPLIMENT*\n\n${target}, ${compliment}`
    });
  }
};
