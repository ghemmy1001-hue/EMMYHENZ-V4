module.exports = {
  name: 'remini',
  description: 'Image enhancement command',

  async execute(sock, sender, args, msg) {
    const image =
      msg.message?.imageMessage ||
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

    if (!image) {
      return sock.sendMessage(sender, {
        text:
          '✨ Reply to an image with .remini\n\n' +
          'This command is ready for an image-enhancement API.'
      });
    }

    await sock.sendMessage(sender, {
      text:
        '✨ *REMINI*\n\n' +
        'Image received successfully.\n\n' +
        '⚠️ No enhancement API is configured yet, so the image has not been altered.'
    });
  }
};
