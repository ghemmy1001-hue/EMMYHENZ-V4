module.exports = {
  name: 'charfrequency',
  description: 'Show character frequency in text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .charfrequency your text'
      });
    }

    const frequency = {};

    for (const char of text.toLowerCase()) {
      if (char === ' ') continue;
      frequency[char] = (frequency[char] || 0) + 1;
    }

    const result = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([char, count]) => `${char}: ${count}`)
      .join('\n');

    await sock.sendMessage(sender, {
      text: `📊 *CHARACTER FREQUENCY*\n\n${result}`
    });
  }
};
