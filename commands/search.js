module.exports = {
  name: 'search',
  description: 'Search the web',
  async execute(sock, sender, args) {
    const query = args.join(' ').trim();

    if (!query) {
      return sock.sendMessage(sender, {
        text: '🔎 Usage: .search <query>'
      });
    }

    await sock.sendMessage(sender, {
      text:
`🔎 *WEB SEARCH*

Query:
${query}

🌐 Search:
https://www.google.com/search?q=${encodeURIComponent(query)}`
    });
  }
};
