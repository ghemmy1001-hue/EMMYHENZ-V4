const facts = [
  'Honey can remain edible for an extremely long time when properly stored. 🍯',
  'Octopuses have three hearts. 🐙',
  'Bananas are botanically classified as berries. 🍌',
  'A day on Venus is longer than a Venusian year. 🪐',
  'Lightning can heat the surrounding air to extremely high temperatures. ⚡',
  'Some bamboo species can grow very quickly under ideal conditions. 🎋'
];

module.exports = {
  name: 'fact3',
  description: 'Get a random interesting fact',

  async execute(sock, sender) {
    const fact =
      facts[Math.floor(Math.random() * facts.length)];

    await sock.sendMessage(sender, {
      text:
`🧠 *DID YOU KNOW?*

${fact}`
    });
  }
};
