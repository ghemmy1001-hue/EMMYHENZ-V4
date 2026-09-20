module.exports = {
  name: 'memory',
  description: 'Show bot memory usage',

  async execute(sock, sender) {
    const used = process.memoryUsage();

    const mb = bytes => (bytes / 1024 / 1024).toFixed(2);

    await sock.sendMessage(sender, {
      text:
        `🧠 *MEMORY USAGE*\n\n` +
        `📊 RSS: *${mb(used.rss)} MB*\n` +
        `⚙️ Heap: *${mb(used.heapUsed)} / ${mb(used.heapTotal)} MB*`
    });
  }
};
