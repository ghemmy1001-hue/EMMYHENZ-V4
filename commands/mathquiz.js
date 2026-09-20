module.exports = {
  name: 'mathquiz',
  description: 'Generate a math question',
  async execute(sock, sender) {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-', '×'];
    const op =
      operators[Math.floor(Math.random() * operators.length)];

    let answer;

    if (op === '+') answer = a + b;
    if (op === '-') answer = a - b;
    if (op === '×') answer = a * b;

    await sock.sendMessage(sender, {
      text:
`🧮 *MATH QUIZ*

What is:

*${a} ${op} ${b} = ?*

💡 Answer: ||${answer}||`
    });
  }
};
