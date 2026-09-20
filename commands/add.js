const g = require('../utils/group');

module.exports = {
  name: 'add',
  description: 'Add a member to the group',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const number = args[0]
      ? args[0].replace(/\D/g, '')
      : '';

    if (!number) {
      return sock.sendMessage(sender, {
        text: '❌ Usage: .add 2348012345678'
      });
    }

    if (number.length < 10) {
      return sock.sendMessage(sender, {
        text: '❌ Invalid phone number.'
      });
    }

    const target = number + '@s.whatsapp.net';

    try {
      const result = await sock.groupParticipantsUpdate(
        sender,
        [target],
        'add'
      );

      console.log('Add result:', result);

      await sock.sendMessage(sender, {
        text: '✅ Add request processed.'
      });
    } catch (error) {
      console.error('Add error:', error);

      await sock.sendMessage(sender, {
        text: '❌ I could not add that number.'
      });
    }
  }
};
