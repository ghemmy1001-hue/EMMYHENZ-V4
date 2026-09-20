const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function run(args) {
  return new Promise((resolve, reject) => {
    execFile('yt-dlp', args, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) return reject(new Error(stderr || error.message));
      resolve(stdout.trim());
    });
  });
}

module.exports = {
  name: 'ig',
  description: 'Download Instagram media',

  async execute(sock, sender, args) {
    const url = args[0];

    if (!url || !/https?:\/\/(www\.)?instagram\.com\//i.test(url)) {
      return sock.sendMessage(sender, {
        text: '📸 Usage:\n.ig <Instagram URL>'
      });
    }

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'emmyhenz-'));
    const output = path.join(dir, '%(title).80s.%(ext)s');

    try {
      await sock.sendMessage(sender, {
        text: '⏳ Downloading Instagram media...'
      });

      await run([
        '--no-playlist',
        '--max-filesize', '50M',
        '-o', output,
        url
      ]);

      const file = fs.readdirSync(dir)
        .map(x => path.join(dir, x))
        .find(x => fs.statSync(x).isFile());

      if (!file) throw new Error('No media was produced.');

      await sock.sendMessage(sender, {
        document: fs.readFileSync(file),
        fileName: path.basename(file),
        mimetype: 'application/octet-stream'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Instagram download failed.\n\n${error.message.slice(0, 1000)}`
      });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
};
