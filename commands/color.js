module.exports = {
  name: 'color',
  description: 'Generate a random color',
  async execute(sock, sender) {
    const hex =
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0');

    await sock.sendMessage(sender, {
      text:
`🎨 *RANDOM COLOR*

HEX: *${hex}*

RGB:
${parseInt(hex.slice(1,3),16)},
${parseInt(hex.slice(3,5),16)},
${parseInt(hex.slice(5,7),16)}`
    });
  }
};
