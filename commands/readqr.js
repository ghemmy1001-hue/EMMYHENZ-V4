module.exports = {
  name: 'readqr',
  description: 'Read a QR code from an image',
  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`📱 *QR READER*

Reply to a QR-code image with:
.readqr

🔄 QR decoding support will be connected to the media engine next.`
    });
  }
};
