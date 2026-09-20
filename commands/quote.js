module.exports = {
  name: 'quote',
  description: 'Send a motivational quote',

  async execute(sock, sender) {
    const quotes = [
      "💫 Keep going. Small progress is still progress.",
      "🔥 Your future is built by what you do today.",
      "🚀 Learn, build, fail, improve, repeat.",
      "💪 Don't stop because it's hard. Keep learning.",
      "🌟 Believe in your ability to improve."
    ];

    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    await sock.sendMessage(sender, {
      text: `✨ *QUOTE*\n\n${quote}`
    });
  }
};
