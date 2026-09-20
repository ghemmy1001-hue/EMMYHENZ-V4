const https = require('https');

function searchLyrics(query) {
  return new Promise((resolve, reject) => {
    const url =
      'https://api.lyrics.ovh/v1/' +
      encodeURIComponent(query.split('-')[0].trim()) +
      '/' +
      encodeURIComponent(query.split('-').slice(1).join('-').trim());

    https.get(url, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);

          if (!result.lyrics) {
            return resolve(null);
          }

          resolve(result.lyrics);
        } catch {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

module.exports = {
  name: 'lyrics',
  description: 'Search for song lyrics',

  async execute(sock, sender, args) {
    const query = args.join(' ').trim();

    if (!query) {
      return sock.sendMessage(sender, {
        text:
          '🎵 *LYRICS*\n\n' +
          'Usage:\n' +
          '.lyrics Artist - Song\n\n' +
          'Example:\n' +
          '.lyrics Adele - Hello'
      });
    }

    await sock.sendMessage(sender, {
      text: `🔎 Searching for lyrics...\n\n🎵 ${query}`
    });

    try {
      const lyrics = await searchLyrics(query);

      if (!lyrics) {
        return sock.sendMessage(sender, {
          text:
            '❌ Lyrics not found.\n\n' +
            'Try:\n' +
            '.lyrics Artist - Song'
        });
      }

      const cleanLyrics = lyrics
        .replace(/\r/g, '')
        .trim();

      const excerpt =
        cleanLyrics.length > 700
          ? cleanLyrics.substring(0, 700) + '\n\n…'
          : cleanLyrics;

      await sock.sendMessage(sender, {
        text:
          `🎵 *${query}*\n\n` +
          `📝 *Lyrics excerpt:*\n\n` +
          `${excerpt}\n\n` +
          `⚡ EMMYHENZ-V4`
      });

    } catch (error) {
      console.log('❌ Lyrics error:', error.message);

      await sock.sendMessage(sender, {
        text:
          '❌ Unable to search lyrics right now.\n' +
          'Please try again later.'
      });
    }
  }
};
