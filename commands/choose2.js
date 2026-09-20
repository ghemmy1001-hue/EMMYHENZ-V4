module.exports = {
  name: 'choose2',
  description: 'Choose between options',
  async execute(sock, sender, args) {
    if (args.length < 2) {
      return sock.sendMessage(sender, {
        text: '🎯 Usage: .choose2 pizza rice'
      });
    }

    const choice =
      args[Math.floor(Math.random() * args.length)];

    await sock.sendMessage(sender, {
      text: `🎯 I choose: *${choice}*`
    });
  }
};
