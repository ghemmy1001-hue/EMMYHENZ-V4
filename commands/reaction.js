module.exports = {
  name: 'reaction',
  description: 'Send a random reaction',
  async execute(sock, sender) {
    const reactions = [
      '😂😂😂',
      '😭😭😭',
      '🔥🔥🔥',
      '💀💀💀',
      '😳😳😳',
      '🤯🤯🤯',
      '🥶🥶🥶',
      '👀👀👀'
    ];

    const reaction =
      reactions[Math.floor(Math.random() * reactions.length)];

    await sock.sendMessage(sender, {
      text: reaction
    });
  }
};
