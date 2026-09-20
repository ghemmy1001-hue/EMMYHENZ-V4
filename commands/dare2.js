module.exports = {
  name: 'dare2',
  description: 'Random harmless dare',

  async execute(sock, sender) {
    const dares = [
      'Send your funniest emoji combination.',
      'Say something nice about someone in the group.',
      'Change your status to a funny sentence for 5 minutes.',
      'Send a voice note saying your favorite food.',
      'Type your next message using only emojis.'
    ];

    const dare =
      dares[Math.floor(Math.random() * dares.length)];

    await sock.sendMessage(sender, {
      text: `🔥 *DARE*\n\n${dare}`
    });
  }
};
