module.exports = {
  name: 'riddle2',
  description: 'Send a random riddle',
  async execute(sock, sender) {
    const riddles = [
      {
        q: 'What has keys but cannot open locks?',
        a: 'A piano 🎹'
      },
      {
        q: 'What has a face and two hands but no arms or legs?',
        a: 'A clock 🕐'
      },
      {
        q: 'What gets wetter the more it dries?',
        a: 'A towel 🧻'
      },
      {
        q: 'What has many teeth but cannot bite?',
        a: 'A comb 💇'
      }
    ];

    const r =
      riddles[Math.floor(Math.random() * riddles.length)];

    await sock.sendMessage(sender, {
      text:
`🧩 *RIDDLE*

${r.q}

💡 Answer: ||${r.a}||`
    });
  }
};
