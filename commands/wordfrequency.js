module.exports = {
  name: 'wordfrequency',
  description: 'Show word frequency in text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .wordfrequency your text'
      });
    }

    const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
    const frequency = {};

    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }

    const result = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => `${word}: ${count}`)
      .join('\n');

    await sock.sendMessage(sender, {
      text: `📚 *WORD FREQUENCY*\n\n${result}`
    });
  }
};
