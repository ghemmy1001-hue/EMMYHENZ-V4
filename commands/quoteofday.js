const quotes = [
  'Believe in yourself and keep moving forward. 💪',
  'Small progress is still progress. 🚀',
  'Your future is created by what you do today. 🌟',
  'Stay focused and keep learning. 📚',
  'Great things take time. ⏳',
  'Do not stop until you are proud. 🔥',
  'Consistency beats motivation when motivation fades. 💯',
  'Every expert was once a beginner. 🌱'
];

module.exports = {
  name: 'quoteofday',
  description: 'Show a random motivational quote',

  async execute(sock, sender) {
    const quote =
      quotes[Math.floor(Math.random() * quotes.length)];

    await sock.sendMessage(sender, {
      text:
`🌟 *QUOTE OF THE DAY*

"${quote}"

— EMMYHENZ-V4 🤖`
    });
  }
};
