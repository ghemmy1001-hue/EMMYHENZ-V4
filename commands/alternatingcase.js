module.exports = {
  name: 'alternatingcase',
  description: 'Convert text to alternating uppercase and lowercase',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .alternatingcase hello world'
      });
    }

    let index = 0;

    const result = [...text]
      .map(char => {
        if (!/[a-z]/i.test(char)) {
          return char;
        }

        const output =
          index % 2 === 0
            ? char.toUpperCase()
            : char.toLowerCase();

        index++;
        return output;
      })
      .join('');

    await sock.sendMessage(sender, {
      text:
`🔀 *ALTERNATING CASE*

${result}`
    });
  }
};
