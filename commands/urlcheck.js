module.exports = {
  name: 'urlcheck',
  description: 'Check whether a URL responds',
  async execute(sock, sender, args) {
    let url = args[0];

    if (!url) {
      return sock.sendMessage(sender, {
        text: '🌐 Usage: .urlcheck https://example.com'
      });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow'
      });

      await sock.sendMessage(sender, {
        text: `╭━━〔 🌐 URL CHECK 〕━━╮
┃
┃ 🔗 URL: ${url}
┃ 📡 Status: ${response.status}
┃ 📋 Result: ${response.ok ? '✅ Reachable' : '⚠️ Server responded with an error'}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
      });
    } catch {
      await sock.sendMessage(sender, {
        text: `❌ Could not reach:\n${url}`
      });
    }
  }
};
