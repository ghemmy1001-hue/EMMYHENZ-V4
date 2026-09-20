module.exports = {
  name: 'savecontact',
  description: 'Show contact information',

  async execute(sock, sender, args, msg) {
    const context =
      msg.message?.extendedTextMessage?.contextInfo;

    const target =
      context?.mentionedJid?.[0] ||
      context?.participant ||
      sender;

    const number =
      target.split('@')[0];

    await sock.sendMessage(sender, {
      text:
`📇 *CONTACT INFORMATION*

📱 Number:
+${number}

🆔 JID:
${target}

💡 Save this number to your phone contacts.`
    });
  }
};
