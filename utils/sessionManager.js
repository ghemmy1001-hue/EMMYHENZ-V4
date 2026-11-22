const fs = require('fs');
const path = require('path');
const pino = require('pino');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  Browsers,
  fetchLatestWaWebVersion
} = require('@whiskeysockets/baileys');

const SESSIONS_DIR =
  process.env.SESSIONS_DIR ||
  path.join(
    __dirname,
    '..',
    'sessions'
  );

if (
  !fs.existsSync(
    SESSIONS_DIR
  )
) {
  fs.mkdirSync(
    SESSIONS_DIR,
    {
      recursive: true
    }
  );
}

const activeSessions =
  new Map();

/*
|--------------------------------------------------------------------------
| NORMALIZE NUMBER
|--------------------------------------------------------------------------
*/

function normalizeNumber(number) {
  return String(
    number || ''
  ).replace(
    /\D/g,
    ''
  );
}

/*
|--------------------------------------------------------------------------
| SESSION PATH
|--------------------------------------------------------------------------
*/

function getSessionPath(number) {
  return path.join(
    SESSIONS_DIR,
    normalizeNumber(number)
  );
}

/*
|--------------------------------------------------------------------------
| CREATE SESSION
|--------------------------------------------------------------------------
*/

async function createSession(
  number,
  onUpdate
) {
  number =
    normalizeNumber(number);

  if (
    !number ||
    number.length < 8
  ) {
    throw new Error(
      'Invalid WhatsApp number.'
    );
  }

  /*
   * Do not create duplicate
   * sessions for the same number.
   */

  if (
    activeSessions.has(number)
  ) {
    return activeSessions.get(
      number
    );
  }

  const authPath =
    getSessionPath(number);

  const {
    state,
    saveCreds
  } =
    await useMultiFileAuthState(
      authPath
    );

const { version } = await fetchLatestWaWebVersion();
console.log('Using WhatsApp Web version:', version.join('.'));

const sock = makeWASocket({
  version,
  auth: state,
  logger: pino({ level: 'silent' }),
  browser: Browsers.macOS('Chrome'),
  printQRInTerminal: false,
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 60000,
  keepAliveIntervalMs: 15000,
  markOnlineOnConnect: false
});

  const session = {
    number,
    socket: sock,
    status: 'connecting',
    pairingCode: null,
    qr: null,
    error: null,
    createdAt: Date.now()
  };

  activeSessions.set(
    number,
    session
  );

  sock.ev.on(
    'creds.update',
    saveCreds
  );
  /*
  |--------------------------------------------------------------------------
  | CONNECTION UPDATE
  |--------------------------------------------------------------------------
  */

  sock.ev.on(
    'connection.update',
    async update => {

      const {
        connection,
        lastDisconnect,
        qr
      } = update;
 console.log('[SESSION DEBUG]', {
  connection,
  hasQR: Boolean(qr),
  statusCode: lastDisconnect?.error?.output?.statusCode,
  error: lastDisconnect?.error?.message
});
      /*
      |--------------------------------------------------------------------------
      | QR FALLBACK
      |--------------------------------------------------------------------------
      */

      if (qr) {
        session.qr = qr;

        if (
          session.status !==
          'pairing'
        ) {
          session.status =
            'qr';
        }

        console.log(
          `📷 QR received for ${number}`
        );

        if (onUpdate) {
          await onUpdate(
            session,
            'qr'
          );
        }
      }

      /*
      |--------------------------------------------------------------------------
      | CONNECTION OPEN
      |--------------------------------------------------------------------------
      */

      if (
        connection === 'open'
      ) {
        session.status =
          'connected';

        session.pairingCode =
          null;

        session.qr = null;

        session.error =
          null;

        console.log(
          `🟢 ${number} connected`
        );

        if (onUpdate) {
          await onUpdate(
            session,
            'connected'
          );
        }

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | CONNECTION CLOSED
      |--------------------------------------------------------------------------
      */

      if (
        connection === 'close'
      ) {
        const statusCode =
          lastDisconnect
            ?.error
            ?.output
            ?.statusCode;

        session.status =
          'disconnected';

        session.error =
          `Connection closed${
            statusCode
              ? ` (${statusCode})`
              : ''
          }`;

        console.log(
          `🔴 ${number} disconnected`
        );

        console.log(
          `📛 Status: ${
            statusCode ||
            'unknown'
          }`
        );

        if (onUpdate) {
          await onUpdate(
            session,
            'disconnected'
          );
        }

        activeSessions.delete(
          number
        );
      }
    }
  );

  /*
  |--------------------------------------------------------------------------
  | REQUEST PAIRING CODE
  |--------------------------------------------------------------------------
  */

  let pairingRequested = false;
  let resolvePairing;

  const pairingReady = new Promise(resolve => {
    resolvePairing = resolve;
  });

  // Wait for the socket to become ready before requesting a code.
  const pairingHandler = async update => {
    const { connection, qr } = update;

    if (
      state.creds.registered ||
      pairingRequested ||
      !(connection === 'connecting' || qr)
    ) return;

    pairingRequested = true;

    try {
      console.log(`Requesting pairing code for ${number}...`);

await new Promise(resolve => setTimeout(resolve, 5000));

if (session.status !== 'connecting') {
  console.log('Session closed before pairing request.');
  return;
}

const code = await sock.requestPairingCode(number);
      session.pairingCode = code;
      session.status = 'pairing';

      console.log(`Pairing code generated for ${number}`);

      if (onUpdate) {
        await onUpdate(session, 'pairing');
      }
    } catch (error) {
      session.status = 'error';
      session.error = error.message;

      console.log('Pairing error:', error.message);

      if (onUpdate) {
        await onUpdate(session, 'error');
      }
    } finally {
      resolvePairing();
    }
  };

  sock.ev.on('connection.update', pairingHandler);

  if (!state.creds.registered) {
    await Promise.race([
      pairingReady,
      new Promise(resolve => setTimeout(resolve, 30000))
    ]);

    if (!session.pairingCode && session.status === 'connecting') {
      session.status = 'error';
      session.error = 'Timed out waiting for WhatsApp connection.';
    }
  }

  return session;
}

/*
|--------------------------------------------------------------------------
| GET SESSION
|--------------------------------------------------------------------------
*/

function getSession(number) {
  return activeSessions.get(
    normalizeNumber(number)
  );
}

/*
|--------------------------------------------------------------------------
| LIST SESSIONS
|--------------------------------------------------------------------------
*/

function listSessions() {
  return Array.from(
    activeSessions.values()
  ).map(
    session => ({
      number:
        session.number,

      status:
        session.status,

      createdAt:
        session.createdAt
    })
  );
}

/*
|--------------------------------------------------------------------------
| REMOVE SESSION
|--------------------------------------------------------------------------
*/

async function removeSession(
  number
) {
  number =
    normalizeNumber(number);

  const session =
    activeSessions.get(
      number
    );

  if (session) {
    try {
      session.socket.end(
        undefined
      );
    } catch {}

    activeSessions.delete(
      number
    );
  }

  const folder =
    getSessionPath(number);

  if (
    fs.existsSync(folder)
  ) {
    fs.rmSync(
      folder,
      {
        recursive: true,
        force: true
      }
    );
  }

  return true;
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  createSession,
  getSession,
  listSessions,
  removeSession,
  normalizeNumber
};
