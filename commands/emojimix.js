module.exports = {
  name: 'emojimix',
  description: 'Mix two emojis',

  async execute(sock, sender, args) {
    if (args.length < 2) {
      return sock.sendMessage(sender, {
        text: '😎 Usage: .emojimix 😂 🔥'
      });
    }

    const first = args[0];
    const second = args[1];

    await sock.sendMessage(sender, {
      text:
`🎨 *EMOJI MIX*

${first} + ${second}

✨ ${first}${second}
🔥 ${second}${first}`
    });
  }
};
