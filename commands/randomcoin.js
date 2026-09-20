module.exports = {
  name: 'randomcoin',
  description: 'Flip a virtual coin',

  async execute(sock, sender) {
    const result =
      Math.random() < 0.5
        ? 'HEADS 🪙'
        : 'TAILS 🪙';

    await sock.sendMessage(sender, {
      text:
`🪙 *COIN FLIP*

Result:
*${result}*`
    });
  }
};
