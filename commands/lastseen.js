module.exports = {
  name: 'lastseen',
  description: 'Explain last-seen availability',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`👁️ *LAST SEEN*

WhatsApp does not provide bots with reliable access to another user's private Last Seen status.

🔒 For privacy reasons, I cannot retrieve or bypass another person's Last Seen setting.

You can use WhatsApp's own profile/chat information to check it when available.`
    });
  }
};
