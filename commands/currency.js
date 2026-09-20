module.exports = {
  name: 'currency',
  description: 'Convert currencies',
  async execute(sock, sender, args) {
    if (args.length < 3) {
      return sock.sendMessage(sender, {
        text:
`💱 *CURRENCY*

Usage:
.currency <amount> <from> <to>

Example:
.currency 100 USD NGN`
      });
    }

    const amount = Number(args[0]);
    const from = args[1].toUpperCase();
    const to = args[2].toUpperCase();

    if (!Number.isFinite(amount)) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid amount.'
      });
    }

    try {
      const response =
        await fetch(
          `https://open.er-api.com/v6/latest/${encodeURIComponent(from)}`
        );

      const data = await response.json();

      if (data.result !== 'success' || !data.rates?.[to]) {
        throw new Error('Currency not supported.');
      }

      const result = amount * data.rates[to];

      await sock.sendMessage(sender, {
        text:
`💱 *CURRENCY CONVERSION*

${amount} ${from}
≈ *${result.toFixed(2)} ${to}*

📊 Rate: ${data.rates[to]}`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Conversion failed.\n${error.message}`
      });
    }
  }
};
