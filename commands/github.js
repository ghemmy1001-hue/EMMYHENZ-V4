module.exports = {
  name: 'github',
  description: 'Search GitHub repositories',
  async execute(sock, sender, args) {
    const query = args.join(' ');

    if (!query) {
      return sock.sendMessage(sender, {
        text: '🐙 Usage: .github whatsapp bot'
      });
    }

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`,
        {
          headers: {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'EMMYHENZ-V4'
          }
        }
      );

      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

      const data = await response.json();

      if (!data.items?.length) {
        return sock.sendMessage(sender, {
          text: '❌ No repositories found.'
        });
      }

      const results = data.items.map((repo, i) =>
        `${i + 1}. ${repo.full_name}\n⭐ ${repo.stargazers_count}\n🔗 ${repo.html_url}`
      ).join('\n\n');

      await sock.sendMessage(sender, {
        text: `╭━━〔 🐙 GITHUB SEARCH 〕━━╮

${results}

╰━━━━━━━━━━━━━━━━━━━━╯`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ GitHub search failed:\n${error.message}`
      });
    }
  }
};
