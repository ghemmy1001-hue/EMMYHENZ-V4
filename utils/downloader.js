const { execFile } = require('child_process');
const { promisify } = require('util');

const exec = promisify(execFile);

async function ytDlp(url, args = []) {
  const { stdout } = await exec(
    'yt-dlp',
    ['--no-playlist', ...args, url],
    {
      maxBuffer: 50 * 1024 * 1024
    }
  );

  return stdout.trim();
}

function isUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  ytDlp,
  isUrl
};
