const dares = [
  'Send a funny emoji and explain why you chose it 😂',
  'Change your WhatsApp status to something funny for a while.',
  'Send the group your best joke.',
  'Type your next message using only emojis.',
  'Say three nice things about your best friend.',
  'Tell the group your favorite game.'
];

module.exports = {
  name: 'dare',
  description: 'Get a fun dare',

  async execute(sock, sender) {
    const dare =
      dares[Math.floor(Math.random() * dares.length)];

    await sock.sendMessage(sender, {
      text:
        `🔴 *DARE*\n\n${dare}`
    });
  }
};
