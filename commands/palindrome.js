module.exports = {
  name: 'palindrome',
  description: 'Check whether text is a palindrome',

  async execute(sock, sender, args) {
    const text = args.join(' ');

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Usage: .palindrome level'
      });
    }

    const cleaned = text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const reversed =
      cleaned.split('').reverse().join('');

    const result = cleaned === reversed;

    await sock.sendMessage(sender, {
      text:
        `🔎 *PALINDROME CHECK*\n\n` +
        `Text: *${text}*\n` +
        `Result: *${result ? 'YES ✅' : 'NO ❌'}*`
    });
  }
};
