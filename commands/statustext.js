module.exports = {
  name: 'statustext',
  description: 'Post text to WhatsApp Status',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: '📝 Example: .statustext Good morning everyone!'
      });
    }

    try {
      await sock.sendMessage('status@broadcast', {
        text
      });

      await sock.sendMessage(sender, {
        text: '✅ Text posted to WhatsApp Status.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Status upload failed.\n${error.message}`
      });
    }
  }
};
