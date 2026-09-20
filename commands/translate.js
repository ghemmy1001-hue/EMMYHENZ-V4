module.exports = {
  name: 'translate',
  description: 'Translate text',

  async execute(sock, sender, args) {
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(sender, {
        text:
          '🌐 *TRANSLATE*\n\n' +
          'Usage:\n' +
          '.translate en hello world\n\n' +
          'The first word is the target language.'
      });
    }

    const parts = input.split(/\s+/);
    const language = parts.shift();
    const text = parts.join(' ');

    if (!text) {
      return sock.sendMessage(sender, {
        text: '❌ Enter text to translate.'
      });
    }

    try {
      const url =
        'https://api.mymemory.translated.net/get?q=' +
        encodeURIComponent(text) +
        '&langpair=auto|' +
        encodeURIComponent(language);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Translation service unavailable');
      }

      const data = await response.json();

      const translated =
        data?.responseData?.translatedText;

      if (!translated) {
        throw new Error('No translation returned');
      }

      await sock.sendMessage(sender, {
        text:
          `🌐 *TRANSLATION*\n\n` +
          `Language: *${language}*\n` +
          `Result: *${translated}*`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Translation failed.\n\n${error.message}`
      });
    }
  }
};

