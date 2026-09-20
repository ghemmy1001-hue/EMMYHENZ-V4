module.exports = {
  name: 'translate2',
  description: 'Translate text',
  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🌍 Usage: .translate2 <text>'
      });
    }

    try {
      const url =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`;

      const response = await fetch(url);
      const data = await response.json();

      const translated =
        data.responseData?.translatedText;

      if (!translated) {
        throw new Error('Translation unavailable.');
      }

      await sock.sendMessage(sender, {
        text:
`🌍 *TRANSLATION*

🇬🇧 ${text}

🇪🇸 ${translated}`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Translation failed.\n${error.message}`
      });
    }
  }
};
