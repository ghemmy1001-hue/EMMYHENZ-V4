module.exports = {
  name: 'blackjack',
  description: 'Play blackjack',
  async execute(sock, sender) {
    const card = () => Math.floor(Math.random() * 11) + 1;
    const player = card() + card();
    const dealer = card() + card();

    await sock.sendMessage(sender, {
      text:
`🃏 *BLACKJACK*

👤 You: *${player}*
🤖 Dealer: *${dealer}*

${player > 21 ? '💥 Bust!' : '🎲 Hit or stand game coming next.'}`
    });
  }
};
