const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function getVideo(msg) {
  const m = msg.message;

  if (m?.videoMessage) return m.videoMessage;

  return m?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage || null;
}

async function download(video) {
  const stream = await downloadContentFromMessage(video, 'video');
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'statusvid',
  description: 'Post a quoted video to WhatsApp Status',

  async execute(sock, sender, args, msg) {
    const video = await getVideo(msg);

    if (!video) {
      return sock.sendMessage(sender, {
        text: '🎥 Reply to a video with .statusvid'
      });
    }

    try {
      const buffer = await download(video);

      await sock.sendMessage('status@broadcast', {
        video: buffer,
        caption: args.join(' ').trim() || ''
      });

      await sock.sendMessage(sender, {
        text: '✅ Video posted to WhatsApp Status.'
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Status upload failed.\n${error.message}`
      });
    }
  }
};
