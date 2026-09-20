module.exports = {
  name: 'statusview',
  description: 'Show status command information',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text:
`📱 *WHATSAPP STATUS*

Available commands:

.statusimg
.statusvid
.statustext
.statusaudio

Reply to the appropriate media and use the command.`
    });
  }
};
