module.exports = {
  name: 'weather2',
  description: 'Show weather information',
  async execute(sock, sender, args) {
    const city = args.join(' ').trim();

    if (!city) {
      return sock.sendMessage(sender, {
        text: '🌦️ Usage: .weather2 <city>\nExample: .weather2 Ibadan'
      });
    }

    try {
      const url =
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Weather service unavailable');
      }

      const data = await response.json();
      const current = data.current_condition?.[0];

      if (!current) throw new Error('Weather data unavailable');

      await sock.sendMessage(sender, {
        text:
`🌦️ *WEATHER*

📍 Location: ${city}
🌡️ Temperature: ${current.temp_C}°C
🤒 Feels like: ${current.FeelsLikeC}°C
💧 Humidity: ${current.humidity}%
💨 Wind: ${current.windspeedKmph} km/h
☁️ Condition: ${current.weatherDesc?.[0]?.value || 'Unknown'}`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ Weather error: ${error.message}`
      });
    }
  }
};
