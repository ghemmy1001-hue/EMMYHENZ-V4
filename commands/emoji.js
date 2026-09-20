module.exports = {
  name: 'emoji',
  description: 'Send a random emoji',
  async execute(sock, sender) {
    const emojis = [
      '😂','🤣','🔥','❤️','💀','😭','😎','🤯',
      '🥶','😈','👑','💯','🚀','🎯','⚡','🗿',
      '🤝','🙌','😍','🤔','😴','🥳','👀','💎'
    ];

    const emoji =
      emojis[Math.floor(Math.random() * emojis.length)];

    await sock.sendMessage(sender, {
      text: `🎲 Random emoji: ${emoji}`
    });
  }
};
