const {
  listSessions
} = require('../utils/sessionManager');

module.exports = {
  name: 'sessions',
  description: 'Show active paired sessions',

  async execute(sock, sender) {

    try {

      const sessions =
        listSessions();

      if (!sessions.length) {

        await sock.sendMessage(
          sender,
          {
            text:
`╔══════════════════════════════╗
║      📱 ACTIVE SESSIONS      ║
╠══════════════════════════════╣
║                              ║
║ No additional sessions yet.  ║
║                              ║
║ Use .pair to connect a       ║
║ WhatsApp number.             ║
╚══════════════════════════════╝`
          }
        );

        return;
      }

      let text =
`╔══════════════════════════════╗
║      📱 ACTIVE SESSIONS      ║
╠══════════════════════════════╣
`;

      sessions.forEach(
        (session, index) => {

          text +=
`
${index + 1}. 📱 ${session.number}
   📡 Status: ${session.status}
`;
        }
      );

      text +=
`
╠══════════════════════════════╣
║ Use .pair to add another     ║
║ WhatsApp session.            ║
╚══════════════════════════════╝`;

      await sock.sendMessage(
        sender,
        {
          text
        }
      );

    } catch (error) {

      console.log(
        '❌ Sessions command error:',
        error.message
      );

      await sock.sendMessage(
        sender,
        {
          text:
            `❌ Could not retrieve sessions.\n\n${error.message}`
        }
      );
    }
  }
};
