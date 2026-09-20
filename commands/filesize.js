module.exports = {
  name: 'filesize',
  description: 'Show the size of a quoted media file',

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
        text: '📦 Reply to a media/file with .filesize'
      });
    }

    const bytes = media.fileLength || 0;

    const format = size => {
      if (!size) return 'Unknown';

      const units = ['B', 'KB', 'MB', 'GB'];
      let i = 0;
      let value = Number(size);

      while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
      }

      return `${value.toFixed(2)} ${units[i]}`;
    };

    await sock.sendMessage(sender, {
      text:
`📦 *FILE SIZE*

Size: ${format(bytes)}
Bytes: ${bytes || 'Unknown'}`
    });
  }
};
