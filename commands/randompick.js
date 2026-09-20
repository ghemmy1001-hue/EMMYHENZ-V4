module.exports = {
  name: 'randompick',
  description: 'Randomly pick a person',
  async execute(sock, sender, args) {
    if (!args.length) {
      return sock.sendMessage(sender, {
        text: '🎲 Usage: .randompick Emmy Tobi John'
      });
    }

    const picked =
      args[Math.floor(Math.random() * args.length)];

    await sock.sendMessage(sender, {
      text: `🎲 *RANDOM PICK*\n\nWinner: *${picked}* 🎉`
    });
  }
};
