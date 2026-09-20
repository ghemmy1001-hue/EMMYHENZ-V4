const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile('yt-dlp', args, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

module.exports = {
  name: 'yt',
  description: 'Download media from a YouTube URL',

  async execute(sock, sender, args) {
    const url = args[0];

    if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      return sock.sendMessage(sender, {
        text: '📥 Usage:\n.yt <YouTube URL>'
      });
    }

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'emmyhenz-'));
    const output = path.join(dir, '%(title).80s.%(ext)s');

    try {
      await sock.sendMessage(sender, {
        text: '⏳ Downloading YouTube video...\n\nPlease wait.'
      });

      await runYtDlp([
        '--no-playlist',
        '--max-filesize', '50M',
        '-f', 'bv*+ba/b',
        '--merge-output-format', 'mp4',
        '-o', output,
        url
      ]);

      const files = fs.readdirSync(dir)
        .map(file => path.join(dir, file))
        .filter(file => fs.statSync(file).isFile());

      if (!files.length) {
        throw new Error('No media file was produced.');
      }

      const file = files[0];

      await sock.sendMessage(sender, {
        video: fs.readFileSync(file),
        mimetype: 'video/mp4',
        caption: '🎬 Downloaded by EMMYHENZ-V4'
      });

    } catch (error) {
      console.error('YT error:', error.message);

      await sock.sendMessage(sender, {
        text: `❌ YouTube download failed.\n\n${error.message.slice(0, 1000)}`
      });
    } finally {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {}
    }
  }
};
