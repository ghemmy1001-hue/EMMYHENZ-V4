module.exports = {
  name: 'qr',
  description: 'Generate a QR code',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text:
          '📱 *QR CODE*\n\n' +
          'Usage:\n' +
          '.qr Your text or link'
      });
    }

    try {
      const url =
        'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' +
        encodeURIComponent(text);

      await sock.sendMessage(sender, {
        image: { url },
        caption:
          `📱 *QR CODE GENERATED*\n\n` +
          `Content: ${text}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ QR generation failed.\n\n${error.message}`
      });
    }
  }
};
