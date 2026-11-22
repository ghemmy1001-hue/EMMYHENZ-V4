const {
  getGroupData,
  userIsAdmin,
  botIsAdmin
} = require('./group');

const security = require('./security');

const messageHistory = new Map();
const warnings = new Map();
const metadataCache = new Map();

const SETTINGS = {
  maxMessages: 6,
  timeWindow: 10000,
  duplicateLimit: 3,
  duplicateWindow: 20000,
  maxWarnings: 3
};

async function handleAntiSpam(sock, msg, text) {
  const chat = msg.key.remoteJid;
  const sender = msg.key.participant;

  if (!chat?.endsWith('@g.us') || !sender) {
    return false;
  }

  if (!security.get(chat, 'antispam')) {
    return false;
  }

  const now = Date.now();
  const userKey = `${chat}:${sender}`;

  try {
    let metadata = metadataCache.get(chat);

    if (!metadata || now - metadata.time > 30000) {
      metadata = {
        data: await getGroupData(sock, chat),
        time: now
      };

      metadataCache.set(chat, metadata);
    }

    if (userIsAdmin(metadata.data, sender)) {
      return false;
    }

    const history = messageHistory.get(userKey) || [];

    const recent = history.filter(
      item => now - item.time < SETTINGS.timeWindow
    );

    const duplicateCount = history.filter(
      item =>
        item.text === text.toLowerCase() &&
        now - item.time < SETTINGS.duplicateWindow
    ).length;

    recent.push({
      text: text.toLowerCase(),
      time: now
    });

    messageHistory.set(userKey, recent);

    const isFlood = recent.length > SETTINGS.maxMessages;
    const isDuplicate = duplicateCount >= SETTINGS.duplicateLimit - 1;

    if (!isFlood && !isDuplicate) {
      return false;
    }

    const count = (warnings.get(userKey) || 0) + 1;
    warnings.set(userKey, count);

    if (botIsAdmin(metadata.data, sock)) {
      try {
        await sock.sendMessage(chat, {
          delete: msg.key
        });
      } catch (error) {
        console.log('Spam deletion failed:', error.message);
      }
    }

    await sock.sendMessage(chat, {
      text:
        `⚠️ ANTI-SPAM WARNING\n\n` +
        `Member: @${sender.split('@')[0]}\n` +
        `Warning: ${count}/${SETTINGS.maxWarnings}\n\n` +
        `Please stop sending repeated messages or flooding the group.`,
      mentions: [sender]
    });

    if (count >= SETTINGS.maxWarnings) {
      await sock.sendMessage(chat, {
        text:
          `🚨 @${sender.split('@')[0]} has reached the warning limit.\n` +
          `Group administrators should review this member.`,
        mentions: [sender]
      });
    }

    return true;

  } catch (error) {
    console.error('Anti-spam error:', error.message);
    return false;
  }
}

module.exports = handleAntiSpam;
