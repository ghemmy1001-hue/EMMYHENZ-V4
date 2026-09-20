module.exports = {
  name: 'tts',
  description: 'Convert text to speech',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text:
          '🔊 *TTS*\n\n' +
          'Usage:\n' +
          '.tts Hello everyone'
      });
    }

    if (text.length > 200) {
      return sock.sendMessage(sender, {
        text: '❌ Keep the text below 200 characters.'
      });
    }

    try {
      const url =
        'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=' +
        encodeURIComponent(text);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('TTS service unavailable');
      }

      const buffer =
        Buffer.from(await response.arrayBuffer());

      await sock.sendMessage(sender, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: true
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ TTS failed.\n\n${error.message}`
      });
    }
  }
};
