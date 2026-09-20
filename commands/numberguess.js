module.exports = {
  name: 'numberguess',
  description: 'Generate a number guessing challenge',

  async execute(sock, sender) {
    const number =
      Math.floor(Math.random() * 100) + 1;

    await sock.sendMessage(sender, {
      text:
`🎯 *NUMBER GUESS CHALLENGE*

I picked a number between *1 and 100*.

Can you guess it? 🤔

🔐 Secret number generated.

Reply with your guess.`
    });

    console.log(
      `[NUMBER GUESS] ${sender}: ${number}`
    );
  }
};
