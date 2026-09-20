module.exports = {
  name: 'unshort',
  description: 'Expand a shortened URL',

  async execute(sock, sender, args) {
    const url = args[0];

    if (!url) {
      return sock.sendMessage(sender, {
        text: '🔗 Example: .unshort https://bit.ly/example'
      });
    }

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual'
      });

      const location =
        response.headers.get('location');

      await sock.sendMessage(sender, {
        text:
`🔗 *URL CHECK*

Original:
${url}

Redirect:
${location || 'No redirect detected'}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Could not inspect URL.\n${error.message}`
      });
    }
  }
};
