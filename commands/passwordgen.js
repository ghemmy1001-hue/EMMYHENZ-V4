module.exports = {
  name: 'passwordgen',
  description: 'Generate a random password',
  async execute(sock, sender, args) {
    const length = Math.min(
      Math.max(Number(args[0]) || 12, 6),
      32
    );

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    let password = '';

    for (let i = 0; i < length; i++) {
      password +=
        chars[Math.floor(Math.random() * chars.length)];
    }

    await sock.sendMessage(sender, {
      text:
`🔐 *PASSWORD GENERATOR*

Length: ${length}

\`${password}\`

⚠️ Don't share passwords with anyone.`
    });
  }
};
