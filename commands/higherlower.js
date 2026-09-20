module.exports = {
  name: 'higherlower',
  description: 'Guess whether the next number is higher or lower',
  async execute(sock, sender, args) {
    const current = Math.floor(Math.random() * 100) + 1;
    const next = Math.floor(Math.random() * 100) + 1;
    const choice = (args[0] || '').toLowerCase();

    if (!['higher', 'lower'].includes(choice)) {
      return sock.sendMessage(sender, {
        text:
`🎯 *HIGHER OR LOWER*

Current number: *${current}*

Use:
.higherlower higher
.higherlower lower`
      });
    }

    const correct =
      choice === 'higher'
        ? next > current
        : next < current;

    await sock.sendMessage(sender, {
      text:
`🎯 *HIGHER OR LOWER*

Current: *${current}*
Next: *${next}*

${correct ? '✅ Correct!' : '❌ Wrong!'}`
    });
  }
};
