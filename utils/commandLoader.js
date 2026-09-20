const fs = require('fs');
const path = require('path');

function loadCommands() {
  const commands = new Map();

  const commandsPath = path.join(__dirname, '..', 'commands');

  if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath, { recursive: true });
  }

  const files = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of files) {
    try {
      const command = require(path.join(commandsPath, file));

      if (!command.name || typeof command.execute !== 'function') {
        console.log(`⚠️ Skipping invalid command: ${file}`);
        continue;
      }

      commands.set(command.name.toLowerCase(), command);

      console.log(`✅ Loaded command: .${command.name}`);

    } catch (error) {
      console.log(`❌ Failed to load ${file}: ${error.message}`);
    }
  }

  return commands;
}

module.exports = loadCommands;
