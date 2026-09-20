const config = require('../config');

async function askAI(prompt, model) {
  if (!config.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'Authorization':
          `Bearer ${config.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://localhost',
        'X-Title': config.BOT_NAME || 'WhatsApp Bot'
      },

      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      `OpenRouter request failed (${response.status})`
    );
  }

  const answer =
    data?.choices?.[0]?.message?.content;

  if (!answer) {
    throw new Error('AI returned an empty response.');
  }

  return answer.trim();
}

module.exports = {
  askAI
};
