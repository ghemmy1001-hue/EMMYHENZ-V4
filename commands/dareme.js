const dares = [
  'Send a funny emoji to the group. 😂',
  'Change your status to something funny.',
  'Send your best joke.',
  'Type your next message using only emojis.',
  'Compliment someone in the group.',
  'Tell the group your favorite game.',
  'Send a funny GIF.'
];

module.exports = {
  name: 'dareme',
  description: 'Get a random safe dare',

  async execute(sock, sender) {
    const dare =
      dares[Math.floor(Math.random() * dares.length)];

    await sock.sendMessage(sender, {
      text:
`🔥 *DARE*

${dare}

⚠️ Keep it safe and respectful.`
    });
  }
};
