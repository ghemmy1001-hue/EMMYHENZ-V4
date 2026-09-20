module.exports = {
  name: 'wordcount2',
  description: 'Show detailed text statistics',

  async execute(sock, sender, args) {
    const text =
      args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(sender, {
        text: 'Usage: .wordcount2 your text here'
      });
    }

    const words =
      text.split(/\s+/).filter(Boolean);

    const letters =
      (text.match(/[A-Za-z]/g) || []).length;

    const numbers =
      (text.match(/[0-9]/g) || []).length;

    const spaces =
      (text.match(/\s/g) || []).length;

    const characters =
      [...text].length;

    await sock.sendMessage(sender, {
      text:
`📊 *TEXT STATISTICS*

📝 Characters: *${characters}*
🔤 Letters: *${letters}*
🔢 Numbers: *${numbers}*
⬜ Spaces: *${spaces}*
📖 Words: *${words.length}*`
    });
  }
};
