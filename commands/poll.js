module.exports = {
  name: 'poll',
  description: 'Create a WhatsApp poll',
  async execute(sock, sender, args) {
    const input = args.join(' ');

    if (!input.includes('|')) {
      return sock.sendMessage(sender, {
        text: '📊 Usage:\n.poll Question | Option 1 | Option 2 | Option 3'
      });
    }

    const parts = input
      .split('|')
      .map(x => x.trim())
      .filter(Boolean);

    const question = parts.shift();
    const options = parts.slice(0, 12);

    if (options.length < 2) {
      return sock.sendMessage(sender, {
        text: '❌ A poll needs at least 2 options.'
      });
    }

    await sock.sendMessage(sender, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  }
};
