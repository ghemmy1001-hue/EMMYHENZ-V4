module.exports = {
  name: 'shorturl',
  description: 'Shorten a URL',

  async execute(sock, sender, args) {
    const url = args[0]?.trim();

    if (!url) {
      return sock.sendMessage(sender, {
        text:
          '🔗 *SHORTURL*\n\n' +
          'Usage:\n' +
          '.shorturl https://example.com'
      });
    }

    try {
      new URL(url);
    } catch {
      return sock.sendMessage(sender, {
        text: '❌ Please provide a valid URL.'
      });
    }

    try {
      const api =
        'https://tinyurl.com/api-create.php?url=' +
        encodeURIComponent(url);

      const response =
        await fetch(api);

      if (!response.ok) {
        throw new Error('Shortener unavailable');
      }

      const shortUrl =
        (await response.text()).trim();

      await sock.sendMessage(sender, {
        text:
          `🔗 *URL SHORTENER*\n\n` +
          `Original:\n${url}\n\n` +
          `Short URL:\n${shortUrl}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Could not shorten the URL.\n\n` +
          `${error.message}`
      });
    }
  }
};
