module.exports = {
  name: 'consonants',
  description: 'Count consonants in text',

  async execute(sock, sender, args) {
    const text =
      args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .consonants your text'
      });
    }

    const consonants =
      text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || [];

    await sock.sendMessage(sender, {
      text:
`🔤 *CONSONANT COUNTER*

Text:
${text}

🔢 Consonants:
*${consonants.length}*`
    });
  }
};
