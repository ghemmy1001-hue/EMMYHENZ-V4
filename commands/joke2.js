module.exports = {
  name: 'joke2',
  description: 'Send a random joke',
  async execute(sock, sender) {
    const jokes = [
      'Why did the computer go to the doctor? Because it had a virus. 😂',
      'Why was the math book sad? It had too many problems. 📚😂',
      'Why did the phone wear glasses? It lost its contacts. 🤓📱',
      'What do you call a sleeping computer? A nap-top. 😂💻',
      'Why did the developer go broke? Because he used up all his cache. 💀'
    ];

    const joke =
      jokes[Math.floor(Math.random() * jokes.length)];

    await sock.sendMessage(sender, {
      text: `😂 *JOKE*\n\n${joke}`
    });
  }
};
