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
  name: 'ytmp3',
  description: 'Download audio from YouTube',

  async execute(sock, sender, args) {
    const url = args[0];

    if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      return sock.sendMessage(sender, {
        text: '🎵 Usage:\n.ytmp3 <YouTube URL>'
      });
    }

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'emmyhenz-'));
    const output = path.join(dir, '%(title).80s.%(ext)s');

    try {
      await sock.sendMessage(sender, {
        text: '⏳ Downloading audio...'
      });

      await runYtDlp([
        '--no-playlist',
        '--max-filesize', '20M',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '128K',
        '-o', output,
        url
      ]);

      const file = fs.readdirSync(dir)
        .map(name => path.join(dir, name))
        .find(file => file.endsWith('.mp3'));

      if (!file) {
        throw new Error('Audio file was not produced.');
      }

      await sock.sendMessage(sender, {
        audio: fs.readFileSync(file),
        mimetype: 'audio/mpeg',
        fileName: path.basename(file)
      });

    } catch (error) {
      console.error('YTMP3 error:', error.message);

      await sock.sendMessage(sender, {
        text: `❌ Audio download failed.\n\n${error.message.slice(0, 1000)}`
      });
    } finally {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {}
    }
  }
};
