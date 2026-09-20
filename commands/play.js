const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile(
      'yt-dlp',
      args,
      {
        maxBuffer: 10 * 1024 * 1024
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }

        resolve(stdout.trim());
      }
    );
  });
}

module.exports = {
  name: 'play',
  description: 'Search YouTube and send the audio',

  async execute(sock, sender, args) {
    const query = args.join(' ').trim();

    if (!query) {
      return sock.sendMessage(sender, {
        text: '🎵 Usage:\n.play <song name>'
      });
    }

    const dir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'emmyhenz-play-')
    );

    const output = path.join(
      dir,
      '%(title).80s.%(ext)s'
    );

    try {
      await sock.sendMessage(sender, {
        text: `🔎 Searching YouTube for:\n*${query}*\n\n⏳ Downloading audio...`
      });

      /*
       * Search YouTube and immediately download
       * the first matching result as MP3.
       */
      await runYtDlp([
        `ytsearch1:${query}`,

        '--no-playlist',

        '--max-filesize',
        '20M',

        '-x',

        '--audio-format',
        'mp3',

        '--audio-quality',
        '128K',

        '-o',
        output
      ]);

      const files = fs.readdirSync(dir)
        .map(file => path.join(dir, file))
        .filter(file => file.endsWith('.mp3'));

      if (!files.length) {
        throw new Error('No audio file was produced.');
      }

      const audioFile = files[0];

      await sock.sendMessage(sender, {
        audio: fs.readFileSync(audioFile),
        mimetype: 'audio/mpeg',
        fileName: path.basename(audioFile),
        ptt: false
      });

      console.log(
        `✅ .play sent: ${path.basename(audioFile)}`
      );

    } catch (error) {

      console.error(
        '❌ PLAY ERROR:',
        error.message
      );

      await sock.sendMessage(sender, {
        text:
          `❌ *Play failed*\n\n` +
          `${error.message.slice(0, 1200)}`
      });

    } finally {

      try {
        fs.rmSync(dir, {
          recursive: true,
          force: true
        });
      } catch {}
    }
  }
};
