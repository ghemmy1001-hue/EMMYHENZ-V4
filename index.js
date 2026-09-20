const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const fs = require('fs');
const path = require('path');

const loadCommands = require('./utils/commandLoader');
const config = require('./config');

const {
  createSession,
  normalizeNumber
} = require('./utils/sessionManager');

const commands = loadCommands();

const pendingPairing = new Map();

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getText(message) {
  if (!message) return '';

  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.documentMessage?.caption ||
    ''
  ).trim();
}

function isGroup(jid) {
  return (
    typeof jid === 'string' &&
    jid.endsWith('@g.us')
  );
}

function containsLink(text) {
  return /https?:\/\/\S+|www\.\S+|chat\.whatsapp\.com\/\S+/i.test(text);
}

function getMentionCount(message) {
  const context =
    message?.extendedTextMessage?.contextInfo ||
    message?.imageMessage?.contextInfo ||
    message?.videoMessage?.contextInfo ||
    message?.documentMessage?.contextInfo ||
    {};

  return context.mentionedJid?.length || 0;
}

function getParticipantJid(participant) {
  if (typeof participant === 'string') {
    return participant;
  }

  return (
    participant?.id ||
    participant?.jid ||
    null
  );
}

/*
|--------------------------------------------------------------------------
| GROUP DATA
|--------------------------------------------------------------------------
*/

function loadGroupMessages(filename) {
  const dataDir =
    path.join(__dirname, 'data');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, {
      recursive: true
    });
  }

  const file =
    path.join(dataDir, filename);

  if (!fs.existsSync(file)) {
    return {};
  }

  try {
    return JSON.parse(
      fs.readFileSync(file, 'utf8')
    );
  } catch {
    return {};
  }
}

function formatGroupMessage(
  template,
  jid,
  groupName
) {
  if (!template) return '';

  const number =
    jid
      ? jid.split('@')[0]
      : 'member';

  return template
    .replace(
      /@user/gi,
      `@${number}`
    )
    .replace(
      /@group/gi,
      groupName
    );
}

/*
|--------------------------------------------------------------------------
| SECURITY
|--------------------------------------------------------------------------
*/

const BAD_WORDS = [
  'badword1',
  'badword2'
];

async function handleSecurity(
  sock,
  msg,
  text
) {
  const remoteJid =
    msg.key.remoteJid;

  if (!isGroup(remoteJid)) {
    return false;
  }

  if (
    text.startsWith(config.PREFIX)
  ) {
    return false;
  }

  try {
    const metadata =
      await sock.groupMetadata(
        remoteJid
      );

    const participantJid =
      msg.key.participant ||
      msg.key.remoteJid;

    const participant =
      metadata.participants.find(
        p =>
          p.id === participantJid ||
          p.phoneNumber === participantJid ||
          p.lid === participantJid
      );

    const isAdmin =
      participant?.admin === 'admin' ||
      participant?.admin === 'superadmin' ||
      participant?.isAdmin === true ||
      participant?.isSuperAdmin === true;

    if (isAdmin) {
      return false;
    }

    let security = null;

    try {
      security =
        require('./utils/security');
    } catch {
      return false;
    }

    if (
      security.get(
        remoteJid,
        'antilink'
      ) &&
      containsLink(text)
    ) {
      try {
        await sock.sendMessage(
          remoteJid,
          {
            delete: msg.key
          }
        );

        await sock.sendMessage(
          remoteJid,
          {
            text:
              '🚫 Link detected. Message removed.'
          }
        );

        return true;
      } catch {}
    }

    if (
      security.get(
        remoteJid,
        'antitag'
      ) &&
      getMentionCount(
        msg.message
      ) >= 5
    ) {
      try {
        await sock.sendMessage(
          remoteJid,
          {
            delete: msg.key
          }
        );

        await sock.sendMessage(
          remoteJid,
          {
            text:
              '🏷️ Mention spam detected. Message removed.'
          }
        );

        return true;
      } catch {}
    }

    if (
      security.get(
        remoteJid,
        'antibadword'
      ) &&
      BAD_WORDS.some(
        word =>
          text
            .toLowerCase()
            .includes(
              word.toLowerCase()
            )
      )
    ) {
      try {
        await sock.sendMessage(
          remoteJid,
          {
            delete: msg.key
          }
        );

        await sock.sendMessage(
          remoteJid,
          {
            text:
              '🛡️ Inappropriate language detected. Message removed.'
          }
        );

        return true;
      } catch {}
    }

  } catch (error) {
    console.log(
      '❌ Security error:',
      error.message
    );
  }

  return false;
}

/*
|--------------------------------------------------------------------------
| WELCOME / GOODBYE
|--------------------------------------------------------------------------
*/

function registerGroupEvents(sock) {
  sock.ev.on(
    'group-participants.update',
    async update => {
      try {
        const {
          id,
          participants,
          action
        } = update;

        if (
          !id ||
          !Array.isArray(participants)
        ) {
          return;
        }

        if (
          action !== 'add' &&
          action !== 'remove'
        ) {
          return;
        }

        const metadata =
          await sock.groupMetadata(id);

        const groupName =
          metadata.subject ||
          'the group';

        /*
        |--------------------------------------------------------------------------
        | ANTIBOT
        |--------------------------------------------------------------------------
        */

        if (action === 'add') {
          let security;

          try {
            security = require('./utils/security');
          } catch (error) {
            console.log(
              '❌ Could not load security module:',
              error.message
            );
            security = null;
          }

          if (
            security &&
            security.get(id, 'antibot')
          ) {
            const botJids = [];

            for (const participant of participants) {
              const jid =
                getParticipantJid(participant);

              if (!jid) continue;

              /*
              | WhatsApp participant objects can expose
              | bot-related device information differently
              | across Baileys versions. We only use explicit
              | bot indicators here.
              */

              const isBot =
                participant?.isBot === true ||
                participant?.bot === true ||
                participant?.type === 'bot';

              if (isBot) {
                botJids.push(jid);
              }
            }

            if (botJids.length > 0) {
              const botMetadata =
                await sock.groupMetadata(id);

              const botAdmin =
                botMetadata.participants.find(
                  p => {
                    const jid =
                      getParticipantJid(p);

                    return (
                      jid === sock.user?.id &&
                      (
                        p.admin === 'admin' ||
                        p.admin === 'superadmin' ||
                        p.isAdmin === true ||
                        p.isSuperAdmin === true
                      )
                    );
                  }
                );

              if (botAdmin) {
                for (const botJid of botJids) {
                  try {
                    await sock.groupParticipantsUpdate(
                      id,
                      [botJid],
                      'remove'
                    );

                    await sock.sendMessage(
                      id,
                      {
                        text:
`🤖 *ANTIBOT*

Bot account detected and removed.

@${botJid.split('@')[0]}`,
                        mentions: [botJid]
                      }
                    );

                  } catch (error) {
                    console.log(
                      '❌ Antibot removal error:',
                      error.message
                    );
                  }
                }

                return;
              }
            }
          }
        }

        const filename =
          action === 'add'
            ? 'welcome.json'
            : 'goodbye.json';

        const data =
          loadGroupMessages(filename);

        const template =
          data[id];

        if (!template) {
          return;
        }

        for (
          const participant
          of participants
        ) {
          const jid =
            getParticipantJid(
              participant
            );

          if (!jid) continue;

          const text =
            formatGroupMessage(
              template,
              jid,
              groupName
            );

          if (!text) continue;

          await sock.sendMessage(
            id,
            {
              text,
              mentions: [jid]
            }
          );
        }

      } catch (error) {
        console.log(
          '❌ Group event error:',
          error.message
        );
      }
    }
  );
}

/*
|--------------------------------------------------------------------------
| PAIRING
|--------------------------------------------------------------------------
*/

async function startPairing(
  sock,
  requester,
  rawNumber
) {
  const number =
    normalizeNumber(rawNumber);

  if (
    !number ||
    number.length < 8
  ) {
    await sock.sendMessage(
      requester,
      {
        text:
`❌ Invalid WhatsApp number.

Use international format:

2348012345678

No +, spaces or dashes.`
      }
    );

    return;
  }

  console.log('');
  console.log(
    '===================================='
  );
  console.log(
    '🚀 STARTING PAIRING'
  );
  console.log(
    `📱 Number: ${number}`
  );
  console.log(
    '===================================='
  );

  await sock.sendMessage(
    requester,
    {
      text:
`⏳ Starting pairing...

📱 Number: ${number}

Please wait for the pairing code.`
    }
  );

  try {
    await createSession(
      number,
      async (
        session,
        event
      ) => {

        if (
          event === 'pairing' &&
          session.pairingCode
        ) {
          await sock.sendMessage(
            requester,
            {
              text:
`╔══════════════════════════════╗
║       🔐 PAIRING CODE        ║
╠══════════════════════════════╣
║                              ║
║       ${session.pairingCode}       ║
║                              ║
╚══════════════════════════════╝

📱 Number:
${number}

Open WhatsApp:

Settings
→ Linked Devices
→ Link a Device
→ Link with phone number

Enter the code above.

⚠️ Never share your pairing code.`
            }
          );
        }

        if (
          event === 'connected'
        ) {
          await sock.sendMessage(
            requester,
            {
              text:
`╔══════════════════════════════╗
║       🟢 CONNECTED           ║
╚══════════════════════════════╝

📱 ${number}

WhatsApp connected successfully.

🤖 EMMYHENZ-V4`
            }
          );
        }

        if (
          event === 'error'
        ) {
          await sock.sendMessage(
            requester,
            {
              text:
`❌ Pairing failed.

📱 ${number}

${session.error || 'Unknown error'}`
            }
          );
        }

        if (
          event === 'disconnected'
        ) {
          await sock.sendMessage(
            requester,
            {
              text:
`🔴 Pairing session disconnected.

📱 ${number}

${session.error || 'Connection closed.'}`
            }
          );
        }
      }
    );

  } catch (error) {
    console.log(
      '❌ Pairing error:',
      error.message
    );

    await sock.sendMessage(
      requester,
      {
        text:
`❌ Could not start pairing.

${error.message}`
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| MAIN BOT
|--------------------------------------------------------------------------
*/

async function startBot() {
  const {
    state,
    saveCreds
  } =
    await useMultiFileAuthState(
      './auth'
    );

  const sock =
    makeWASocket({
      auth: state,

      logger:
        pino({
          level: 'silent'
        }),

      browser:
        Browsers.macOS('Chrome'),

      printQRInTerminal: false,

      connectTimeoutMs: 60000,

      defaultQueryTimeoutMs: 60000,

      keepAliveIntervalMs: 15000,

      markOnlineOnConnect: false
    });

  sock.ev.on(
    'creds.update',
    saveCreds
  );

  registerGroupEvents(sock);

  /*
  |--------------------------------------------------------------------------
  | CONNECTION
  |--------------------------------------------------------------------------
  */

  sock.ev.on(
    'connection.update',
    ({
      connection,
      lastDisconnect
    }) => {

      if (
        connection === 'connecting'
      ) {
        console.log(
          '⏳ Connecting to WhatsApp...'
        );
      }

      if (
        connection === 'open'
      ) {
        console.log('');
        console.log(
          '╔══════════════════════════════════╗'
        );
        console.log(
          '║        EMMYHENZ-V4 BOT           ║'
        );
        console.log(
          '╚══════════════════════════════════╝'
        );
        console.log('');

        console.log(
          `🤖 ${config.BOT_NAME}`
        );

        console.log(
          `⚡ Version: ${config.VERSION}`
        );

        console.log(
          `⌨️ Prefix: ${config.PREFIX}`
        );

        console.log(
          `📦 Commands loaded: ${commands.size}`
        );

        console.log(
          '✅ WhatsApp connected!'
        );

        console.log(
          '🚀 Bot is ready.'
        );

        console.log('');
      }

      if (
        connection === 'close'
      ) {
        const statusCode =
          lastDisconnect
            ?.error
            ?.output
            ?.statusCode;

        console.log('');
        console.log(
          '❌ WhatsApp connection closed.'
        );

        console.log(
          `Status: ${
            statusCode || 'unknown'
          }`
        );

        if (
          statusCode ===
          DisconnectReason.loggedOut
        ) {
          console.log(
            '🔒 Session logged out.'
          );

          console.log(
            'Delete ./auth and pair again.'
          );

          return;
        }

        console.log(
          '🔄 Reconnecting in 5 seconds...'
        );

        setTimeout(
          startBot,
          5000
        );
      }
    }
  );

  /*
  |--------------------------------------------------------------------------
  | MESSAGE HANDLER
  |--------------------------------------------------------------------------
  */

  sock.ev.on(
    'messages.upsert',
    async ({
      messages
    }) => {

      try {
        const msg =
          messages?.[0];

        if (
          !msg ||
          !msg.message
        ) {
          return;
        }

        const sender = msg.key.remoteJid;

        global.onlineChats = global.onlineChats || new Set();
        global.onlineChats.add(sender);

        const text =
          getText(
            msg.message
          );

        if (!text) {
          return;
        }

        console.log(
          `📩 ${sender}: ${text}`
        );

        /*
        |--------------------------------------------------------------------------
        | PENDING PAIRING
        |--------------------------------------------------------------------------
        */

        if (
          pendingPairing.has(sender) &&
          !text.startsWith(
            config.PREFIX
          )
        ) {
          pendingPairing.delete(
            sender
          );

          await startPairing(
            sock,
            sender,
            text
          );

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | SECURITY
        |--------------------------------------------------------------------------
        */

        const blocked =
          await handleSecurity(
            sock,
            msg,
            text
          );

        if (blocked) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | COMMAND CHECK
        |--------------------------------------------------------------------------
        */

        if (
          !text.startsWith(
            config.PREFIX
          )
        ) {
          return;
        }

        const body =
          text
            .slice(
              config.PREFIX.length
            )
            .trim();

        if (!body) {
          return;
        }

        const parts =
          body.split(/\s+/);

        const commandName =
          parts
            .shift()
            ?.toLowerCase();

        const args =
          parts;

        if (!commandName) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | DIRECT .PAIR WITH NUMBER
        |--------------------------------------------------------------------------
        */

        if (
          commandName === 'pair' &&
          args.length > 0
        ) {
          await startPairing(
            sock,
            sender,
            args.join('')
          );

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | NORMAL COMMAND
        |--------------------------------------------------------------------------
        */

        const command =
          commands.get(
            commandName
          );

        if (!command) {
          await sock.sendMessage(
            sender,
            {
              text:
`❌ Unknown command:

${config.PREFIX}${commandName}

Use ${config.PREFIX}menu`
            }
          );

          return;
        }

        await command.execute(
          sock,
          sender,
          args,
          msg,
          {
            config,
            commands,
            pendingPairing,

            startPairing:
              async (
                requester,
                number
              ) => {
                await startPairing(
                  sock,
                  requester,
                  number
                );
              }
          }
        );

      } catch (error) {
        console.log(
          '❌ Message handler error:',
          error
        );
      }
    }
  );
}

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

startBot().catch(
  error => {
    console.error(
      '❌ Startup error:',
      error
    );
  }
);
