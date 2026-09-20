module.exports = {
  name: 'fact2',
  description: 'Get a random fact',

  async execute(sock, sender) {
    const facts = [
      '🐙 Octopuses have three hearts.',
      '🧪 Water can exist naturally as solid, liquid and gas.',
      '🌍 Earth is not a perfect sphere.',
      '⚡ Lightning can heat air to extremely high temperatures.',
      '🦈 Sharks existed before many modern tree species.'
    ];

    const fact =
      facts[Math.floor(Math.random() * facts.length)];

    await sock.sendMessage(sender, {
      text: `🧠 *RANDOM FACT*\n\n${fact}`
    });
  }
};
