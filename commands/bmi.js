module.exports = {
  name: 'bmi',
  description: 'Calculate BMI',
  async execute(sock, sender, args) {
    const weight = Number(args[0]);
    const height = Number(args[1]);

    if (
      !Number.isFinite(weight) ||
      !Number.isFinite(height) ||
      weight <= 0 ||
      height <= 0
    ) {
      return sock.sendMessage(sender, {
        text: '⚖️ Usage: .bmi <weight_kg> <height_m>'
      });
    }

    const bmi = weight / (height * height);

    await sock.sendMessage(sender, {
      text:
`⚖️ *BMI CALCULATOR*

Weight: ${weight} kg
Height: ${height} m

BMI: *${bmi.toFixed(2)}*`
    });
  }
};
