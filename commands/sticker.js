module.exports = {
  name: 'sticker',
  description: 'Convert a replied image to a sticker',
  async execute(sock, sender, args, msg) {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return sock.sendMessage(sender, {
        text: '🖼️ Reply to an image with .sticker'
      });
    }

    await sock.sendMessage(sender, {
      text: '⚠️ Sticker conversion needs a media-processing package. This command is installed but not enabled yet.'
    });
  }
};
