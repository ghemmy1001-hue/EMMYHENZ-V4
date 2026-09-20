module.exports = {
  name: 'meme',
  description: 'Get a random meme-style joke',
  async execute(sock, sender) {
    const memes = [
      '😂 Me: I will sleep early today.\nAlso me at 3AM: 👁️👄👁️',
      '🤣 Teacher: Any questions?\nMe: Can we go home?',
      '😭 My internet when I need it most: 📡💀'
    ];

    await sock.sendMessage(sender, {
      text: `😂 *MEME*\n\n${memes[Math.floor(Math.random() * memes.length)]}`
    });
  }
};
