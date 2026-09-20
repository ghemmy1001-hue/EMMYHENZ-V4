module.exports = {
  name: 'date',
  description: 'Show current date',

  async execute(sock, sender) {
    const now = new Date();

    await sock.sendMessage(sender, {
      text: `📅 *CURRENT DATE*\n\n${now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`
    });
  }
};
