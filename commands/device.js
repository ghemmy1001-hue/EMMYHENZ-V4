module.exports = {
  name: 'device',
  description: 'Show message device information',

  async execute(sock, sender, args, msg) {
    const device =
      msg.key?.device ||
      'unknown';

    await sock.sendMessage(sender, {
      text:
        `📱 *DEVICE INFO*\n\n` +
        `Device: *${device}*\n\n` +
        `ℹ️ WhatsApp may not expose complete device information for every message.`
    });
  }
};
