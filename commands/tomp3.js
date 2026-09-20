const { isUrl } = require('../utils/downloader');

module.exports = {
  name: 'tomp3',
  description: 'Convert a media URL to audio',

  async execute(sock, sender, args) {
    const url = args[0];

    if (!url || !isUrl(url)) {
      return sock.sendMessage(sender, {
        text:
          '🎵 *TOMP3*\n\n' +
          'Usage:\n' +
          '.tomp3 https://example.com/video'
      });
    }

    await sock.sendMessage(sender, {
      text: '⏳ Processing your media...'
    });

    // Actual media downloading will be connected
    // after yt-dlp is installed and tested.
    await sock.sendMessage(sender, {
      text:
        'ℹ️ Downloader module is ready. ' +
        'Media processing will be enabled after yt-dlp setup.'
    });
  }
};
