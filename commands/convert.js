module.exports = {
  name: 'convert',
  description: 'Convert common units',
  async execute(sock, sender, args) {
    if (args.length < 3) {
      return sock.sendMessage(sender, {
        text:
`🔄 *UNIT CONVERTER*

Examples:
.convert 10 km miles
.convert 100 c f
.convert 5 kg lb`
      });
    }

    const value = Number(args[0]);
    const from = args[1].toLowerCase();
    const to = args[2].toLowerCase();

    if (!Number.isFinite(value)) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid number.'
      });
    }

    let result;

    if (from === 'km' && (to === 'miles' || to === 'mi')) {
      result = value * 0.621371;
    } else if (
      (from === 'miles' || from === 'mi') &&
      to === 'km'
    ) {
      result = value * 1.60934;
    } else if (from === 'kg' && (to === 'lb' || to === 'lbs')) {
      result = value * 2.20462;
    } else if (
      (from === 'lb' || from === 'lbs') &&
      to === 'kg'
    ) {
      result = value * 0.453592;
    } else if (from === 'c' && to === 'f') {
      result = (value * 9 / 5) + 32;
    } else if (from === 'f' && to === 'c') {
      result = (value - 32) * 5 / 9;
    } else {
      return sock.sendMessage(sender, {
        text: '❌ Unsupported conversion.'
      });
    }

    await sock.sendMessage(sender, {
      text:
`🔄 *CONVERSION*

${value} ${from} = *${result.toFixed(2)} ${to}*`
    });
  }
};
