module.exports = {
  name: 'memorygame',
  description: 'Play a quick memory game',
  async execute(sock, sender) {
    const items = [
      '🍎 Apple',
      '🚗 Car',
      '⚽ Ball',
      '🐱 Cat',
      '🌟 Star'
    ];

    await sock.sendMessage(sender, {
      text:
`🧠 *MEMORY GAME*

Remember these:

${items.join('\n')}

⏳ Try to remember them!`
    });

    setTimeout(async () => {
      await sock.sendMessage(sender, {
        text:
`🧠 *MEMORY TEST*

How many items were shown?

Reply with your answer.`
      });
    }, 5000);
  }
};
