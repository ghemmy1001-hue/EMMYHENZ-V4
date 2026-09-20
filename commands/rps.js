module.exports = {
  name: 'rps',
  description: 'Play rock paper scissors',
  async execute(sock, sender, args) {
    const choices = ['rock', 'paper', 'scissors'];
    const user = (args[0] || '').toLowerCase();

    if (!choices.includes(user)) {
      return sock.sendMessage(sender, {
        text: '✊ .rps rock\n📄 .rps paper\n✂️ .rps scissors'
      });
    }

    const bot = choices[Math.floor(Math.random() * choices.length)];

    let result = 'DRAW 🤝';

    if (
      (user === 'rock' && bot === 'scissors') ||
      (user === 'paper' && bot === 'rock') ||
      (user === 'scissors' && bot === 'paper')
    ) {
      result = 'YOU WIN 🎉';
    } else if (user !== bot) {
      result = 'BOT WINS 🤖';
    }

    await sock.sendMessage(sender, {
      text: `✊📄✂️ RPS

You: ${user}
Bot: ${bot}

🏆 ${result}`
    });
  }
};
