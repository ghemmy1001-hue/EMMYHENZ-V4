module.exports = {
  name: 'define',
  description: 'Look up a word definition',
  async execute(sock, sender, args) {
    const word = args[0]?.trim();

    if (!word) {
      return sock.sendMessage(sender, {
        text: '📖 Example: .define computer'
      });
    }

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
      );

      if (!res.ok) throw new Error('Word not found');

      const data = await res.json();
      const entry = data[0];

      const meanings = entry.meanings
        .slice(0, 3)
        .map((m, i) => {
          const definition =
            m.definitions?.[0]?.definition || 'No definition';

          return `${i + 1}. *${m.partOfSpeech || 'word'}*\n${definition}`;
        })
        .join('\n\n');

      await sock.sendMessage(sender, {
        text:
`📖 *${entry.word}*

${meanings}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not find a definition for "${word}".`
      });
    }
  }
};
