const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

function getMedia(msg) {
  const m = msg.message;

  if (m?.imageMessage) {
    return { type: 'image', data: m.imageMessage };
  }

  if (m?.videoMessage) {
    return { type: 'video', data: m.videoMessage };
  }

  const q =
    m?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (q?.imageMessage) {
    return { type: 'image', data: q.imageMessage };
  }

  if (q?.videoMessage) {
    return { type: 'video', data: q.videoMessage };
  }

  return null;
}

async function download(media) {
  const stream = await downloadContentFromMessage(
    media.data,
    media.type
  );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'caption',
  description: 'Re-send media with a new caption',

  async execute(sock, sender, args, msg) {
    const media = getMedia(msg);
    const caption = args.join(' ').trim();

    if (!media) {
      return sock.sendMessage(sender, {
        text: '📝 Reply to an image or video with .caption your text'
      });
    }

    if (!caption) {
      return sock.sendMessage(sender, {
        text: '📝 Example:\n.caption This is my new caption'
      });
    }

    try {
      const buffer = await download(media);

      await sock.sendMessage(sender, {
        [media.type]: buffer,
        caption
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Caption command failed.\n\n${error.message}`
      });
    }
  }
};
