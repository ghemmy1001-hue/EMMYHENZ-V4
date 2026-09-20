const fs = require('fs');
const path = require('path');
const g = require('../utils/group');

const file = path.join(
  __dirname,
  '..',
  'data',
  'warnings.json'
);

function loadWarnings() {
  if (!fs.existsSync(file)) return {};

  try {
    return JSON.parse(
      fs.readFileSync(file, 'utf8')
    );
  } catch {
    return {};
  }
}

function saveWarnings(data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {
  name: 'warn',

  description:
    'Warn a group member. 3 warnings automatically remove the member.',

  async execute(sock, sender, args, msg) {

    if (!await g.requireGroup(sock, sender)) return;

    const metadata =
      await g.requireBotAdmin(sock, sender);

    if (!metadata) return;

    const target =
      g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text:
          '⚠️ Usage:\n\n' +
          'Reply to a member or mention them with:\n' +
          '.warn @user'
      });
    }

    if (g.userIsAdmin(metadata, target)) {
      return sock.sendMessage(sender, {
        text:
          '❌ You cannot warn a group admin.'
      });
    }

    const warnings = loadWarnings();

    const key = `${sender}:${target}`;

    warnings[key] =
      (warnings[key] || 0) + 1;

    const count = warnings[key];

    /*
    |--------------------------------------------------------------------------
    | WARNING 1 AND 2
    |--------------------------------------------------------------------------
    */

    if (count < 3) {
      saveWarnings(warnings);

      return sock.sendMessage(sender, {
        text:
          `⚠️ *WARNING ${count}/3*\n\n` +
          `👤 Member: @${target.split('@')[0]}\n` +
          `📛 Warnings: *${count}/3*\n\n` +
          `⚠️ 3 warnings = automatic removal.`,

        mentions: [target]
      });
    }

    /*
    |--------------------------------------------------------------------------
    | WARNING 3 — AUTOMATIC REMOVAL
    |--------------------------------------------------------------------------
    */

    try {

      await sock.sendMessage(sender, {
        text:
          `🚨 *WARNING 3/3*\n\n` +
          `👤 Member: @${target.split('@')[0]}\n` +
          `❌ Maximum warnings reached.\n\n` +
          `🚪 Removing member...`,

        mentions: [target]
      });

      await sock.groupParticipantsUpdate(
        sender,
        [target],
        'remove'
      );

      delete warnings[key];
      saveWarnings(warnings);

      await sock.sendMessage(sender, {
        text:
          `✅ *USER REMOVED*\n\n` +
          `👤 @${target.split('@')[0]}\n` +
          `⚠️ Warnings: *3/3*\n` +
          `🚪 Automatically removed from the group.`,

        mentions: [target]
      });

    } catch (error) {

      console.log(
        '❌ Warn/kick error:',
        error.message
      );

      warnings[key] = 3;
      saveWarnings(warnings);

      await sock.sendMessage(sender, {
        text:
          `❌ *AUTO-REMOVE FAILED*\n\n` +
          `👤 Member: @${target.split('@')[0]}\n` +
          `⚠️ Warnings: *3/3*\n\n` +
          `Make sure the bot is a group admin.`,

        mentions: [target]
      });
    }
  }
};
