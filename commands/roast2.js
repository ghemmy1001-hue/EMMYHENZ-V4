module.exports = {
  name: 'roast2',
  description: 'Give a playful roast',
  async execute(sock, sender, args) {
    const target = args.join(' ').trim() || 'you';

    const roasts = [
      'Your Wi-Fi has more connection than your brain today. 😂',
      'Even Google needs time to understand you. 💀',
      'You came prepared… unfortunately for the wrong exam. 😭',
      'Your phone battery has more energy than you. 🔋😂',
      'Bro is running on low graphics settings. 🥶'
    ];

    const roast =
      roasts[Math.floor(Math.random() * roasts.length)];

    await sock.sendMessage(sender, {
      text: `🔥 *PLAYFUL ROAST*\n\n${target}: ${roast}`
    });
  }
};
