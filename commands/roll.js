module.exports = {
  name: 'roll',
  description: 'Roll a dice',
  async execute(sock, sender, args) {
    const sides = Math.min(Math.max(parseInt(args[0]) || 6, 2), 1000);
    const result = Math.floor(Math.random() * sides) + 1;

    await sock.sendMessage(sender, {
      text: `🎲 Rolled a ${sides}-sided dice:\n\n🎯 ${result}`
    });
  }
};
