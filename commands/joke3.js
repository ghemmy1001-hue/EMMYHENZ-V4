const jokes = [
  'Why did the programmer quit his job? Because he did not get arrays. 😂',
  'Why was the computer cold? It left its Windows open. 🥶',
  'Why do programmers prefer dark mode? Because light attracts bugs. 🐛',
  'What did the phone say to the charger? You complete me. 😂',
  'Why did the Wi-Fi go to therapy? It had connection issues. 😭'
];

module.exports = {
  name: 'joke3',
  description: 'Tell a random joke',

  async execute(sock, sender) {
    const joke =
      jokes[Math.floor(Math.random() * jokes.length)];

    await sock.sendMessage(sender, {
      text: `😂 *JOKE TIME*\n\n${joke}`
    });
  }
};
