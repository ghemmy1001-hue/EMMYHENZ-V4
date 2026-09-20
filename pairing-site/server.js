const express = require("express");
const path = require("path");
const fs = require("fs");
const pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestWaWebVersion,
  Browsers
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

const sessionsDir = path.join(__dirname, "sessions");

if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sessions = new Map();

/* =====================================================
   HELPERS
===================================================== */

function cleanPhoneNumber(number) {
  return String(number || "").replace(/\D/g, "");
}

function createSessionId(phone) {
  return `${phone}_${Date.now()}`;
}

/* =====================================================
   START WHATSAPP SESSION
===================================================== */

async function startWhatsApp(sessionId, phoneNumber) {
  const authPath = path.join(sessionsDir, sessionId);

  if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath, { recursive: true });
  }

  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(authPath);

  let version;

  try {
    const latest = await fetchLatestWaWebVersion();

    version = latest.version;

    console.log(
      `🌐 WhatsApp Web: ${version.join(".")}`
    );
  } catch (error) {
    console.log(
      "⚠️ Could not obtain latest WhatsApp Web version."
    );

    console.log(error.message);
  }

  const sock = makeWASocket({
    ...(version ? { version } : {}),

    auth: state,

    logger: pino({
      level: "silent"
    }),

    browser: Browsers.macOS("Chrome"),

    connectTimeoutMs: 60000,

    defaultQueryTimeoutMs: 60000,

    keepAliveIntervalMs: 15000,

    markOnlineOnConnect: false,

    syncFullHistory: false
  });

  const session = {
    id: sessionId,

    phoneNumber,

    socket: sock,

    status: "connecting",

    pairingCode: null,

    error: null,

    createdAt: Date.now()
  };

  sessions.set(sessionId, session);

  /*
   * IMPORTANT:
   * Save authentication credentials whenever
   * Baileys changes them.
   */

  sock.ev.on(
    "creds.update",
    saveCreds
  );

  /* ===================================================
     CONNECTION EVENTS
  =================================================== */

  sock.ev.on(
    "connection.update",
    async update => {

      const {
        connection,
        lastDisconnect
      } = update;

      console.log(
        `📡 ${sessionId}: ${
          connection || "update"
        }`
      );

      /* ===============================================
         CONNECTED
      =============================================== */

      if (connection === "open") {

        session.status = "connected";

        session.pairingCode = null;

        session.error = null;

        console.log("");

        console.log(
          "╔══════════════════════════════════╗"
        );

        console.log(
          "║      ✅ WHATSAPP CONNECTED       ║"
        );

        console.log(
          "╚══════════════════════════════════╝"
        );

        console.log("");
      }

      /* ===============================================
         CLOSED
      =============================================== */

      if (connection === "close") {

        const statusCode =
          lastDisconnect
            ?.error
            ?.output
            ?.statusCode;

        const reason =
          lastDisconnect
            ?.error
            ?.message ||
          "Connection closed";

        session.status = "disconnected";

        session.error =
          `${reason}${
            statusCode
              ? ` (${statusCode})`
              : ""
          }`;

        console.log("");

        console.log(
          "❌ WhatsApp connection closed"
        );

        console.log(
          `Status: ${
            statusCode || "unknown"
          }`
        );

        console.log(
          `Reason: ${reason}`
        );

        console.log("");

        /*
         * Do not automatically create another
         * pairing session here.
         */
      }
    }
  );

  /* ===================================================
     REQUEST PHONE-NUMBER PAIRING CODE
  =================================================== */

  if (!state.creds.registered) {

    try {

      console.log("");

      console.log(
        `🔐 Requesting pairing code for ${phoneNumber}...`
      );

      /*
       * Give the socket a short moment to initialize.
       */

      await new Promise(
        resolve => setTimeout(resolve, 3000)
      );

      const code =
        await sock.requestPairingCode(
          phoneNumber
        );

      session.pairingCode = code;

      session.status = "pairing";

      console.log("");

      console.log(
        "╔══════════════════════════════════╗"
      );

      console.log(
        `║  🔐 PAIRING CODE: ${code}  ║`
      );

      console.log(
        "╚══════════════════════════════════╝"
      );

      console.log("");

    } catch (error) {

      session.status = "error";

      session.error =
        error.message ||
        "Unable to request pairing code.";

      console.error("");

      console.error(
        "❌ Pairing code error:"
      );

      console.error(
        error
      );

      console.error("");
    }

  } else {

    /*
     * Existing authentication was found.
     */

    session.status = "authenticated";

    console.log(
      `🔑 Existing authentication found for ${phoneNumber}`
    );
  }

  return session;
}

/* =====================================================
   CREATE PAIRING SESSION
===================================================== */

app.post(
  "/api/pair",
  async (req, res) => {

    try {

      const phone =
        cleanPhoneNumber(
          req.body.phoneNumber
        );

      if (!phone) {

        return res.status(400).json({

          success: false,

          error:
            "Enter your WhatsApp number."
        });
      }

      if (phone.length < 8) {

        return res.status(400).json({

          success: false,

          error:
            "Invalid phone number."
        });
      }

      /*
       * Prevent multiple active sessions
       * for the same number.
       */

      for (const [
        id,
        existing
      ] of sessions.entries()) {

        if (
          existing.phoneNumber === phone &&
          (
            existing.status === "pairing" ||
            existing.status === "connecting"
          )
        ) {

          return res.json({

            success: true,

            sessionId: id,

            phoneNumber: phone,

            status: existing.status,

            pairingCode:
              existing.pairingCode,

            message:
              "A pairing session already exists for this number."
          });
        }
      }

      const id =
        createSessionId(phone);

      console.log("");

      console.log(
        `📲 New pairing request: ${phone}`
      );

      const session =
        await startWhatsApp(
          id,
          phone
        );

      res.json({

        success: true,

        sessionId: id,

        phoneNumber: phone,

        status: session.status,

        pairingCode:
          session.pairingCode,

        error:
          session.error,

        message:
          "Pairing session created. Poll /api/status/:sessionId for the pairing code."
      });

    } catch (error) {

      console.error(
        "❌ Pair request error:",
        error
      );

      res.status(500).json({

        success: false,

        error:
          error.message ||
          "Unable to start pairing."
      });
    }
  }
);

/* =====================================================
   SESSION STATUS
===================================================== */

app.get(
  "/api/status/:sessionId",
  (req, res) => {

    const session =
      sessions.get(
        req.params.sessionId
      );

    if (!session) {

      return res.status(404).json({

        success: false,

        error:
          "Session not found."
      });
    }

    res.json({

      success: true,

      sessionId:
        session.id,

      phoneNumber:
        session.phoneNumber,

      status:
        session.status,

      pairingCode:
        session.pairingCode,

      error:
        session.error,

      uptime:
        Date.now() -
        session.createdAt
    });
  }
);

/* =====================================================
   LIST SESSIONS
===================================================== */

app.get(
  "/api/sessions",
  (req, res) => {

    const list =
      Array.from(
        sessions.values()
      ).map(session => ({

        sessionId:
          session.id,

        phoneNumber:
          session.phoneNumber,

        status:
          session.status,

        pairingCode:
          session.pairingCode,

        error:
          session.error,

        uptime:
          Date.now() -
          session.createdAt
      }));

    res.json({

      success: true,

      sessions: list
    });
  }
);

/* =====================================================
   HEALTH
===================================================== */

app.get(
  "/api/health",
  (req, res) => {

    res.json({

      success: true,

      service:
        "EMMYHENZ-V4",

      status:
        "online",

      sessions:
        sessions.size,

      uptime:
        process.uptime()
    });
  }
);

/* =====================================================
   HOME
===================================================== */

app.get(
  "/",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );
  }
);

/* =====================================================
   404 API HANDLER
===================================================== */

app.use(
  "/api",
  (req, res) => {

    res.status(404).json({

      success: false,

      error:
        "API endpoint not found."
    });
  }
);

/* =====================================================
   ERROR HANDLER
===================================================== */

app.use(
  (error, req, res, next) => {

    console.error(
      "❌ Server error:",
      error
    );

    res.status(500).json({

      success: false,

      error:
        error.message ||
        "Internal server error."
    });
  }
);

/* =====================================================
   START SERVER
===================================================== */

app.listen(
  PORT,
  () => {

    console.log("");

    console.log(
      "╔══════════════════════════════════╗"
    );

    console.log(
      "║      EMMYHENZ-V4 PAIRING SITE    ║"
    );

    console.log(
      "╚══════════════════════════════════╝"
    );

    console.log("");

    console.log(
      `🌐 http://localhost:${PORT}`
    );

    console.log(
      "🔐 Phone-number pairing: ENABLED"
    );

    console.log(
      "📷 QR pairing: DISABLED"
    );

    console.log(
      "🟢 Server ready."
    );

    console.log("");
  }
);
