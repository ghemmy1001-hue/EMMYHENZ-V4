module.exports = {
  name: 'weather',
  description: 'Get weather information',

  async execute(sock, sender, args) {
    const city = args.join(' ').trim();

    if (!city) {
      return sock.sendMessage(sender, {
        text:
          '🌤️ *WEATHER*\n\n' +
          'Usage:\n' +
          '.weather Ibadan'
      });
    }

    try {
      const url =
        'https://wttr.in/' +
        encodeURIComponent(city) +
        '?format=j1';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Weather service unavailable');
      }

      const data = await response.json();
      const current = data.current_condition?.[0];

      if (!current) {
        throw new Error('Weather data unavailable');
      }

      await sock.sendMessage(sender, {
        text:
          `🌤️ *WEATHER — ${city}*\n\n` +
          `🌡️ Temperature: ${current.temp_C}°C\n` +
          `🤔 Feels like: ${current.FeelsLikeC}°C\n` +
          `💧 Humidity: ${current.humidity}%\n` +
          `💨 Wind: ${current.windspeedKmph} km/h\n` +
          `☁️ Condition: ${current.weatherDesc?.[0]?.value || 'Unknown'}`
      });

    } catch (error) {
      await sock.sendMessage(sender, {
        text:
          `❌ Could not get weather information.\n\n${error.message}`
      });
    }
  }
};
