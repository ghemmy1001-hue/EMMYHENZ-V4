module.exports = {
  name: 'news',
  description: 'Search for news',
  async execute(sock, sender, args) {
    const query = args.join(' ').trim() || 'Nigeria';

    await sock.sendMessage(sender, {
      text:
`📰 *NEWS SEARCH*

Topic: ${query}

🔎 Google News:
https://news.google.com/search?q=${encodeURIComponent(query)}`
    });
  }
};
