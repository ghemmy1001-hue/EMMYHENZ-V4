module.exports = {
  name: 'screenshot',
  description: 'Create a webpage screenshot link',
  async execute(sock, sender, args) {
    const url = args[0];

    if (!url || !/^https?:\/\//i.test(url)) {
      return sock.sendMessage(sender, {
        text: '📸 Usage: .screenshot https://example.com'
      });
    }

    const image =
      `https://image.thum.io/get/width/1200/${url}`;

    await sock.sendMessage(sender, {
      image: { url: image },
      caption: `📸 Screenshot\n${url}`
    });
  }
};
