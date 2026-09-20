module.exports = {
  name: 'randomletter',
  description: 'Generate a random letter',

  async execute(sock, sender) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const letter =
      letters[Math.floor(Math.random() * letters.length)];

    await sock.sendMessage(sender, {
      text:
`🔤 *RANDOM LETTER*

🎯 Letter: *${letter}*`
    });
  }
};
