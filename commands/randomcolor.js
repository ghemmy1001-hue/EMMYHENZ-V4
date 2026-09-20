module.exports = {
  name: 'randomcolor',
  description: 'Generate a random color',

  async execute(sock, sender) {
    const number =
      Math.floor(
        Math.random() * 0xffffff
      );

    const hex =
      '#' + number
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();

    await sock.sendMessage(sender, {
      text:
`🎨 *RANDOM COLOR*

HEX:
*${hex}*

RGB:
*${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}*`
    });
  }
};
