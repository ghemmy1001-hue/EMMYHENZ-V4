module.exports = {
  name: 'joke',
  description: 'Send a random joke',

  async execute(sock, sender) {
    const jokes = [
      "😂 Why do programmers prefer dark mode? Because light attracts bugs.",
      "🤣 I told my computer I needed a break. Now it won't stop sending me vacation ads.",
      "😎 There are only 10 kinds of people: those who understand binary and those who don't.",
      "😂 My code works... I have no idea why.",
      "🤣 A programmer's favorite place? The cache."
    ];

    const joke = jokes[Math.floor(Math.random() * jokes.length)];

    await sock.sendMessage(sender, {
      text: `😂 *RANDOM JOKE*\n\n${joke}`
    });
  }
};
