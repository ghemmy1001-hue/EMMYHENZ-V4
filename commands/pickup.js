module.exports = {
  name: 'pickup',
  description: 'Get a pickup line',
  async execute(sock, sender) {
    const lines = [
      '✨ Are you Wi-Fi? Because I feel a connection.',
      '😎 Are you a keyboard? Because you are just my type.',
      '🔥 You must be a notification because you caught my attention.'
    ];

    await sock.sendMessage(sender, {
      text: `💘 *PICKUP LINE*\n\n${lines[Math.floor(Math.random() * lines.length)]}`
    });
  }
};
