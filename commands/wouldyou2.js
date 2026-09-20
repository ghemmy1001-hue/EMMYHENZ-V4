module.exports = {
  name: 'wouldyou2',
  description: 'Ask a random would-you-rather question',
  async execute(sock, sender) {
    const questions = [
      'Would you rather have unlimited money or unlimited knowledge? 💰🧠',
      'Would you rather fly or become invisible? 🪽👻',
      'Would you rather travel to the past or future? ⏳🚀',
      'Would you rather never use social media or never play games? 📱🎮',
      'Would you rather be famous or completely private? ⭐🔒'
    ];

    const question =
      questions[Math.floor(Math.random() * questions.length)];

    await sock.sendMessage(sender, {
      text: `🤔 *WOULD YOU RATHER?*\n\n${question}`
    });
  }
};
