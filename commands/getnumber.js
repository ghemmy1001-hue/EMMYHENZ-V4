module.exports = {
  name: 'getnumber',
  description: 'Show the number associated with the current chat',

  async execute(sock, sender) {
    const number = sender
      .split('@')[0]
      .split(':')[0];

    await sock.sendMessage(sender, {
      text: `📱 Number/JID:\n+${number}`
    });
  }
};
