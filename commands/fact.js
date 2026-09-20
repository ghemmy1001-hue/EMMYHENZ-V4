module.exports = {
  name: 'fact',
  description: 'Send a random fact',

  async execute(sock, sender) {
    const facts = [
      "🧠 The human brain contains billions of neurons.",
      "🌍 Earth is the third planet from the Sun.",
      "🐙 Octopuses have three hearts.",
      "⚡ Lightning can heat the air around it to extremely high temperatures.",
      "🌊 Most of Earth's surface is covered by water."
    ];

    const fact = facts[Math.floor(Math.random() * facts.length)];

    await sock.sendMessage(sender, {
      text: `🧠 *RANDOM FACT*\n\n${fact}`
    });
  }
};
