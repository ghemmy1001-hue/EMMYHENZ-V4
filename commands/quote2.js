module.exports = {
  name: 'quote2',
  description: 'Send a random quote',
  async execute(sock, sender) {
    const quotes = [
      'Keep going. Small progress is still progress. 🚀',
      'Your future is built by what you do today. 🔥',
      'Stay focused and keep learning. 💯',
      'Consistency beats giving up. 👑',
      'Dream big. Start small. Keep moving. ⚡'
    ];

    const quote =
      quotes[Math.floor(Math.random() * quotes.length)];

    await sock.sendMessage(sender, {
      text: `💭 *QUOTE*\n\n"${quote}"`
    });
  }
};
