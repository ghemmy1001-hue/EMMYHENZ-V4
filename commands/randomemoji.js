const emojis = [
  '😀','😂','😎','🔥','❤️','💀','👑','🚀',
  '🎯','⚡','🌹','🤖','💎','🥶','😈','🗿',
  '🎮','🏆','💯','✨','🤣','😭','😏','🙌'
];

module.exports = {
  name: 'randomemoji',
  description: 'Generate a random emoji',

  async execute(sock, sender) {
    const emoji =
      emojis[Math.floor(Math.random() * emojis.length)];

    await sock.sendMessage(sender, {
      text: `🎲 *RANDOM EMOJI*\n\n${emoji}`
    });
  }
};
