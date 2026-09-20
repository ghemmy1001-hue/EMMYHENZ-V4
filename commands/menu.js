const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'menu',
  description: 'Show the EMMYHENZ-V4 command menu',

  async execute(sock, sender, args, msg, { config, commands }) {
    try {
      /*
      |--------------------------------------------------------------------------
      | MENU IMAGE
      |--------------------------------------------------------------------------
      | Your actual image is:
      | ~/whatsapp-bot/media/menu.jpg
      */
      const imagePath = path.join(
        __dirname,
        '..',
        'media',
        'menu.jpg'
      );

      /*
      |--------------------------------------------------------------------------
      | BOT INFORMATION
      |--------------------------------------------------------------------------
      */

      const p = config.PREFIX || '.';

      const botName =
        config.BOT_NAME ||
        'EMMYHENZ-V4';

      const owner =
        config.OWNER_NAME ||
        'EmmyHenz';

      const version =
        config.VERSION ||
        '4.0.0';

      /*
      |--------------------------------------------------------------------------
      | GET LOADED COMMANDS
      |--------------------------------------------------------------------------
      */

      const commandList = Array.from(
        commands.values()
      )
        .filter(
          command =>
            command &&
            command.name
        )
        .sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );

      /*
      |--------------------------------------------------------------------------
      | BUILD COMMAND LIST
      |--------------------------------------------------------------------------
      */

      const commandLines =
        commandList
          .map(
            (command, index) => {

              const name =
                command.name.toLowerCase();

              const description =
                command.description ||
                'No description available';

              return (
                `┃ ${String(index + 1).padStart(3, '0')}. ${p}${name}\n` +
                `┃      └─ ${description}`
              );
            }
          )
          .join('\n');

      /*
      |--------------------------------------------------------------------------
      | MENU TEXT
      |--------------------------------------------------------------------------
      */

      const menu = `
╭━━━〔 ❄️🌹 *${botName}* 🌹❄️ 〕━━━╮
┃
┃ 👑 Owner : *${owner}*
┃ ⚡ Version : *${version}*
┃ ⌨️ Prefix : *${p}*
┃ 📦 Commands : *${commandList.length}*
┃ 🟢 Status : *ONLINE*
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 📜 *ALL COMMANDS* 〕━━╮
${commandLines}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 ❤️ *${botName}* 〕━━╮
┃
┃ 🤖 MultiDevice WhatsApp Bot
┃ ⚡ ${commandList.length} commands loaded
┃
┃ Type *${p}help <command>* for
┃ detailed command information.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

      /*
      |--------------------------------------------------------------------------
      | CHECK IMAGE
      |--------------------------------------------------------------------------
      */

      if (!fs.existsSync(imagePath)) {
        console.log(
          '⚠️ Menu image not found:',
          imagePath
        );

        await sock.sendMessage(
          sender,
          {
            text: menu
          }
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | READ IMAGE
      |--------------------------------------------------------------------------
      */

      const imageBuffer =
        fs.readFileSync(imagePath);

      console.log(
        `🖼️ Sending menu image: ${imagePath}`
      );

      console.log(
        `📦 Image size: ${imageBuffer.length} bytes`
      );

      /*
      |--------------------------------------------------------------------------
      | SEND IMAGE + MENU
      |--------------------------------------------------------------------------
      */

      await sock.sendMessage(
        sender,
        {
          image: imageBuffer,
          caption: menu
        }
      );

      console.log(
        '✅ Menu image sent successfully.'
      );

    } catch (error) {

      console.log(
        '❌ Menu error:',
        error
      );

      /*
      |--------------------------------------------------------------------------
      | TEXT FALLBACK
      |--------------------------------------------------------------------------
      */

      try {

        await sock.sendMessage(
          sender,
          {
            text:
              `❌ Menu image could not be sent.\n\n` +
              `Here is the command list instead:\n\n` +
              `Use *${config.PREFIX || '.'}help*`
          }
        );

      } catch (sendError) {

        console.log(
          '❌ Failed to send menu fallback:',
          sendError.message
        );
      }
    }
  }
};
