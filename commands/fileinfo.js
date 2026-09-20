module.exports = {
  name: 'fileinfo',
  description: 'Show information about a quoted file',

  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const media =
      quoted?.documentMessage ||
      quoted?.imageMessage ||
      quoted?.videoMessage ||
      quoted?.audioMessage ||
      quoted?.stickerMessage;

    if (!media) {
      return sock.sendMessage(sender, {
        text: '📄 Reply to a file or media with .fileinfo'
      });
    }

    await sock.sendMessage(sender, {
      text:
`📄 *FILE INFORMATION*

📛 Name: ${media.fileName || 'Unknown'}
📦 MIME: ${media.mimetype || 'Unknown'}
📏 Size: ${media.fileLength || 'Unknown'} bytes
📝 Caption: ${media.caption || 'None'}`
    });
  }
};
