const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function getAudio(msg) {
  const m = msg.message;

  if (m?.audioMessage) return m.audioMessage;

  return m?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage || null;
}

async function download(audio) {
  const stream = await downloadContentFromMessage(audio, 'audio');
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'statusaudio',
  description: 'Post audio to WhatsApp Status',

  async execute(sock, sender, args, msg) {
    const audio = await getAudio(msg);

    if (!audio) {
      return sock.sendMessage(sender, {
        text: '🎵 Reply to an audio message with .statusaudio'
      });
    }

    try {
      const buffer = await download(audio);

      await sock.sendMessage('status@broadcast', {
        audio: buffer,
        mimetype: audio.mimetype || 'audio/mpeg'
      });

      await sock.sendMessage(sender, {
        text: '✅ Audio posted to WhatsApp Status.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Status upload failed.\n${error.message}`
      });
    }
  }
};
