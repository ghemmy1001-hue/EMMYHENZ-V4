module.exports = {
  name: 'vv',
  description: 'Detect image or video from a replied message',

  async execute(sock, sender, args, msg) {
    try {
      const quoted =
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quoted) {
        return await sock.sendMessage(sender, {
          text:
`╭━━〔 🔎 VV DETECTOR 〕━━╮
┃
┃ Reply to an image or video
┃ with:
┃
┃ .vv
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        });
      }

      let type = null;

      if (quoted.imageMessage) {
        type = '🖼️ IMAGE';
      } else if (quoted.videoMessage) {
        type = '🎥 VIDEO';
      } else if (quoted.audioMessage) {
        type = '🎵 AUDIO';
      } else if (quoted.documentMessage) {
        type = '📄 DOCUMENT';
      } else if (quoted.stickerMessage) {
        type = '🎨 STICKER';
      }

      if (!type) {
        return await sock.sendMessage(sender, {
          text: '❌ I could not identify the replied message type.'
        });
      }

      await sock.sendMessage(sender, {
        text:
`╭━━〔 🔎 VV DETECTOR 〕━━╮
┃
┃ ✅ Media detected
┃
┃ 📦 Type: ${type}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      });

    } catch (error) {
      console.error('VV command error:', error);

      await sock.sendMessage(sender, {
        text: `❌ VV error: ${error.message}`
      });
    }
  }
};
