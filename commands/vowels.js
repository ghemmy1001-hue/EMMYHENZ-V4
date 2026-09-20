module.exports = {
  name: 'vowels',
  description: 'Count vowels in text',

  async execute(sock, sender, args) {
    const text =
      args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .vowels your text'
      });
    }

    const matches =
      text.match(/[aeiou]/gi) || [];

    await sock.sendMessage(sender, {
      text:
`🔤 *VOWEL COUNTER*

Text:
${text}

A: *${(text.match(/a/gi) || []).length}*
E: *${(text.match(/e/gi) || []).length}*
I: *${(text.match(/i/gi) || []).length}*
O: *${(text.match(/o/gi) || []).length}*
U: *${(text.match(/u/gi) || []).length}*

Total vowels: *${matches.length}*`
    });
  }
};
