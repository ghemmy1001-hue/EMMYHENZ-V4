module.exports = {
  name: 'case',
  description: 'Change text case',

  async execute(sock, sender, args) {
    const input = args.join(' ');
    const parts = input.split(/\s+/);
    const mode = (parts.shift() || '').toLowerCase();
    const text = parts.join(' ');

    if (!text || !['upper', 'lower', 'title'].includes(mode)) {
      return sock.sendMessage(sender, {
        text:
          `🔤 *CASE*\n\n` +
          `Usage:\n` +
          `.case upper hello world\n` +
          `.case lower HELLO WORLD\n` +
          `.case title hello world`
      });
    }

    let result;

    if (mode === 'upper') {
      result = text.toUpperCase();
    } else if (mode === 'lower') {
      result = text.toLowerCase();
    } else {
      result = text
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
    }

    await sock.sendMessage(sender, {
      text: result
    });
  }
};
