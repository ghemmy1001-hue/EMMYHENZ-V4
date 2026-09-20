const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = {
  name: 'say2',
  description: 'Convert text to speech',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '🔊 Example: .say2 Hello everyone'
      });
    }

    const id = `${Date.now()}`;
    const output =
      path.join(os.tmpdir(), `${id}.wav`);

    execFile(
      'espeak',
      [text, '-w', output],
      async error => {
        try {
          if (error) {
            throw error;
          }

          await sock.sendMessage(sender, {
            audio: fs.readFileSync(output),
            mimetype: 'audio/wav'
          });

        } catch {
          await sock.sendMessage(sender, {
            text:
              '❌ Text-to-speech is unavailable.\n\n' +
              'Install espeak with:\n' +
              'pkg install espeak'
          });
        } finally {
          try {
            fs.unlinkSync(output);
          } catch {}
        }
      }
    );
  }
};
