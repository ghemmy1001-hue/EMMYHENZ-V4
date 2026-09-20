module.exports = {
  name: 'poll2',
  description: 'Create a simple poll',
  async execute(sock, sender, args) {
    if (args.length < 2) {
      return sock.sendMessage(sender, {
        text:
`📊 Usage:
.poll2 Question | Option 1 | Option 2`
      });
    }

    const parts = args
      .join(' ')
      .split('|')
      .map(x => x.trim())
      .filter(Boolean);

    if (parts.length < 3) {
      return sock.sendMessage(sender, {
        text:
`📊 Example:
.poll2 Best game? | Free Fire | CODM`
      });
    }

    const question = parts[0];
    const options = parts.slice(1);

    const text =
`📊 *POLL*

❓ ${question}

${options.map((x, i) =>
`${i + 1}. ${x}`
).join('\n')}

Reply with the option number.`;

    await sock.sendMessage(sender, { text });
  }
};
