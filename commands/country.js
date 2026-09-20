module.exports = {
  name: 'country',
  description: 'Show basic country information',
  async execute(sock, sender, args) {
    const country = args.join(' ');

    if (!country) {
      return sock.sendMessage(sender, {
        text: '🌍 Usage: .country Nigeria'
      });
    }

    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`
      );

      if (!res.ok) throw new Error('Country not found');

      const data = await res.json();
      const c = data[0];

      await sock.sendMessage(sender, {
        text: `╭━━〔 🌍 COUNTRY 〕━━╮
┃
┃ 🏳️ Name: ${c.name?.common || 'N/A'}
┃ 🏛️ Capital: ${c.capital?.[0] || 'N/A'}
┃ 🌐 Region: ${c.region || 'N/A'}
┃ 👥 Population: ${(c.population || 0).toLocaleString()}
┃ 💰 Currency: ${Object.keys(c.currencies || {})[0] || 'N/A'}
┃
╰━━━━━━━━━━━━━━━━━━╯`
      });
    } catch (error) {
      await sock.sendMessage(sender, {
        text: `❌ ${error.message}`
      });
    }
  }
};
