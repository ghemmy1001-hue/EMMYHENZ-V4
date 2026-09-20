module.exports = {
  name: 'coin',
  description: 'Flip a coin',

  async execute(sock, sender) {
    const result =
      Math.random() < 0.5 ? 'HEADS 🪙' : 'TAILS 🪙';

    await sock.sendMessage(sender, {
      text: `🪙 *COIN FLIP*\n\nResult: *${result}*`
    });
  }
};
