module.exports = {
  name: 'wikipedia',
  description: 'Search Wikipedia',
  async execute(sock, sender, args) {
    const query = args.join(' ').trim();

    if (!query) {
      return sock.sendMessage(sender, {
        text: '📚 Usage: .wikipedia <topic>'
      });
    }

    try {
      const url =
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Article not found.');
      }

      const data = await response.json();

      await sock.sendMessage(sender, {
        text:
`📚 *WIKIPEDIA*

📌 ${data.title}

${data.extract || 'No summary available.'}

🔗 ${data.content_urls?.desktop?.page || ''}`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Wikipedia search failed.\n${error.message}`
      });
    }
  }
};
