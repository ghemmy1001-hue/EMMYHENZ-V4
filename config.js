require('dotenv').config();

module.exports = {
  BOT_NAME: 'DEV-X WhatsApp Bot',
  VERSION: '4.0.0',
  PREFIX: process.env.BOT_PREFIX || '.',
  OWNER_NUMBER: process.env.OWNER_NUMBER,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
};
