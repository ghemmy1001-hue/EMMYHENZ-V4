module.exports = {
  name: 'slots',
  description: 'Play slot machine',
  async execute(sock, sender) {
    const symbols = ['🍒', '🍋', '⭐', '💎', '7️⃣'];
    const a = symbols[Math.floor(Math.random() * symbols.length)];
    const b = symbols[Math.floor(Math.random() * symbols.length)];
    const c = symbols[Math.floor(Math.random() * symbols.length)];

    const win = a === b && b === c;

    await sock.sendMessage(sender, {
      text:
`🎰 *SLOTS*

╔══════════╗
║ ${a} │ ${b} │ ${c} ║
╚══════════╝

${win ? '🎉 JACKPOT!' : '😅 Try again!'}`
    });
  }
};
