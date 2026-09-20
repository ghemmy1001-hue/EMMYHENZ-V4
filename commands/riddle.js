const riddles = [
  {
    q: 'What has keys but cannot open locks?',
    a: 'A piano 🎹'
  },
  {
    q: 'What has hands but cannot clap?',
    a: 'A clock 🕐'
  },
  {
    q: 'What gets wetter as it dries?',
    a: 'A towel 🧻'
  },
  {
    q: 'What has a face and two hands but no arms or legs?',
    a: 'A clock ⏰'
  },
  {
    q: 'What can travel around the world while staying in one corner?',
    a: 'A stamp ✉️'
  }
];

module.exports = {
  name: 'riddle',
  description: 'Get a random riddle',

  async execute(sock, sender) {
    const riddle =
      riddles[Math.floor(Math.random() * riddles.length)];

    await sock.sendMessage(sender, {
      text:
        `🧩 *RIDDLE*\n\n` +
        `${riddle.q}\n\n` +
        `💡 Answer: ||${riddle.a}||`
    });
  }
};
