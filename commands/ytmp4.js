module.exports = {
  name: 'ytmp4',
  description: 'Download a YouTube video',

  async execute(sock, sender, args, msg, context) {
    const yt = require('./yt');

    return yt.execute(sock, sender, args, msg, context);
  }
};
