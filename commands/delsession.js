const {
  removeSession,
  normalizeNumber
} = require('../utils/sessionManager');

module.exports = {
  name: 'delsession',
  description: 'Remove a paired WhatsApp session',

  async execute(sock, sender, args) {

    try {

      const number =
        normalizeNumber(
          args?.join(' ') || ''
        );

      if (!number) {
        await sock.sendMessage(
          sender,
          {
            text:
`╔══════════════════════════════╗
║      🗑️ REMOVE SESSION       ║
╠══════════════════════════════╣
║                              ║
║ Usage:                       ║
║ .delsession 2348012345678    ║
║                              ║
╚══════════════════════════════╝`
          }
        );

        return;
      }

      await removeSession(number);

      await sock.sendMessage(
        sender,
        {
          text:
`╔══════════════════════════════╗
║      ✅ SESSION REMOVED      ║
╠══════════════════════════════╣
║                              ║
║ 📱 ${number}
║                              ║
║ The saved session has been   ║
║ removed from EMMYHENZ-V4.    ║
╚══════════════════════════════╝`
        }
      );

    } catch (error) {

      console.log(
        '❌ Delete session error:',
        error.message
      );

      await sock.sendMessage(
        sender,
        {
          text:
`❌ Could not remove the session.

${error.message}`
        }
      );
    }
  }
};
