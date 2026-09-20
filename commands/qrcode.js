module.exports = {
  name: 'qrcode',
  description: 'Generate a QR code',
  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📱 Usage: .qrcode <text>'
      });
    }

    const url =
      `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

    await sock.sendMessage(sender, {
      image: { url },
      caption: `📱 QR Code\n\n${text}`
    });
  }
};
