module.exports = {
  name: 'ascii',
  description: 'Convert text to ASCII-style output',
  async execute(sock, sender, args) {
    const text = args.join(' ').trim();
    if (!text) return sock.sendMessage(sender, { text: 'Example: .ascii EMMYHENZ' });

    const out = text
      .toUpperCase()
      .split('')
      .map(c => `[${c}]`)
      .join('');

    await sock.sendMessage(sender, {
      text: `🔤 *ASCII STYLE*\n\n${out}`
    });
  }
};
