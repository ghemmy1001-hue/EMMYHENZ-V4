const {
  downloadContentFromMessage
} = require('@whiskeysockets/baileys');

function getImage(msg) {
  const message = msg?.message;

  if (!message) return null;

  if (message.imageMessage) {
    return message.imageMessage;
  }

  const context =
    message.extendedTextMessage?.contextInfo;

  const quoted =
    context?.quotedMessage;

  if (quoted?.imageMessage) {
    return quoted.imageMessage;
  }

  return null;
}

async function downloadImage(image) {
  const stream =
    await downloadContentFromMessage(
      image,
      'image'
    );

  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

module.exports = {
  name: 'statusimg',

  description:
    'Post a quoted image to WhatsApp Status',

  async execute(sock, sender, args, msg) {
    try {
      const image = getImage(msg);

      if (!image) {
        return sock.sendMessage(sender, {
          text:
            '🖼️ Reply to an image with .statusimg'
        });
      }

      await sock.sendMessage(sender, {
        text:
          '⏳ Uploading image to WhatsApp Status...'
      });

      const buffer =
        await downloadImage(image);

      if (!buffer.length) {
        throw new Error(
          'Image download returned empty data.'
        );
      }

      /*
       * Get the paired account JID.
       */
      const me =
        sock.user?.id ||
        sock.user?.lid;

      if (!me) {
        throw new Error(
          'Could not determine the bot account JID.'
        );
      }

      /*
       * Post to WhatsApp Status.
       */
      await sock.sendMessage(
        'status@broadcast',
        {
          image: buffer,
          caption:
            args.join(' ').trim() || ''
        },
        {
          statusJidList: [me]
        }
      );

      await sock.sendMessage(sender, {
        text:
          '✅ Status message sent successfully.'
      });

    } catch (error) {
      console.log(
        '❌ statusimg error:',
        error
      );

      await sock.sendMessage(sender, {
        text:
`❌ *STATUS FAILED*

${error?.message || 'Unknown error'}`
      });
    }
  }
};
