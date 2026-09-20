module.exports = {
  name: 'qrtext',
  description: 'Generate a QR code from text',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📱 Example: .qrtext Hello Emmy'
      });
    }

    try {
      const url =
        `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

      await sock.sendMessage(sender, {
        image: { url },
        caption: '📱 QR code generated.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ QR generation failed.\n${error.message}`
      });
    }
  }
};
