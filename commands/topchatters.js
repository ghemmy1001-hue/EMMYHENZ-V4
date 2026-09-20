module.exports = {
  name: 'topchatters',
  description: 'Show top chatters placeholder',
  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`💬 *TOP CHATTERS*

Message activity tracking is not enabled yet.

📊 This command is ready for a persistent chat-stat system.`
    });
  }
};
