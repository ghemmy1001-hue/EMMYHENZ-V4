module.exports = {
  name: 'ship2',
  description: 'Calculate a playful compatibility percentage',
  async execute(sock, sender, args) {
    if (args.length < 2) {
      return sock.sendMessage(sender, {
        text: '❤️ Usage: .ship2 Name1 Name2'
      });
    }

    const a = args[0];
    const b = args.slice(1).join(' ');

    let hash = 0;

    for (const char of `${a.toLowerCase()}${b.toLowerCase()}`) {
      hash = (hash * 31 + char.charCodeAt(0)) % 101;
    }

    await sock.sendMessage(sender, {
      text:
`💞 *SHIP CALCULATOR*

${a} ❤️ ${b}

Compatibility:
*${hash}%*

😂 Just for fun!`
    });
  }
};
