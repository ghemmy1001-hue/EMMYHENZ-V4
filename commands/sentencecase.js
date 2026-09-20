module.exports = {
  name: 'sentencecase',
  description: 'Convert text to sentence case',

  async execute(sock, sender, args) {
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .sentencecase your text'
      });
    }

    const result =
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, match =>
          match.toUpperCase()
        );

    await sock.sendMessage(sender, {
      text:
`📝 *SENTENCE CASE*

${result}`
    });
  }
};
