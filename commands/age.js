module.exports = {
  name: 'age',
  description: 'Calculate age from birth date',
  async execute(sock, sender, args) {
    const birth = new Date(args[0]);

    if (Number.isNaN(birth.getTime())) {
      return sock.sendMessage(sender, {
        text: '🎂 Usage: .age 2008-09-12'
      });
    }

    const now = new Date();

    let age =
      now.getFullYear() -
      birth.getFullYear();

    const beforeBirthday =
      now.getMonth() < birth.getMonth() ||
      (
        now.getMonth() === birth.getMonth() &&
        now.getDate() < birth.getDate()
      );

    if (beforeBirthday) age--;

    await sock.sendMessage(sender, {
      text:
`🎂 *AGE CALCULATOR*

Birth date: ${args[0]}
Age: *${age} years*`
    });
  }
};
