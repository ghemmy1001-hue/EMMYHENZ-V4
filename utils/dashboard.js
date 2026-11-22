const http = require('http');
const crypto = require('crypto');

const {
  createSession,
  listSessions,
  getSession,
  normalizeNumber
} = require('./sessionManager');

const HOST = '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);

let dashboardPassword;

function getPassword() {
  if (dashboardPassword) return dashboardPassword;

  dashboardPassword = process.env.DASHBOARD_PASSWORD;

  if (!dashboardPassword) {
    dashboardPassword = crypto.randomBytes(18).toString('hex');

    console.log('\n================================');
    console.log('🔐 EMMYHENZ DASHBOARD PASSWORD');
    console.log(dashboardPassword);
    console.log('================================\n');
    console.log('Keep this password private.');
  } else {
    console.log('🔐 Dashboard password loaded securely.');
  }

  return dashboardPassword;
}

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}

function authorized(req) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Basic ')) return false;

  try {
    const decoded = Buffer.from(
      header.slice(6),
      'base64'
    ).toString();

    const separator = decoded.indexOf(':');

    if (separator < 0) return false;

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);

    const expected = Buffer.from(getPassword());
    const supplied = Buffer.from(password);

    return (
      username === 'admin' &&
      expected.length === supplied.length &&
      crypto.timingSafeEqual(expected, supplied)
    );
  } catch {
    return false;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;

      if (body.length > 2048) {
        reject(new Error('Request too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EMMYHENZ Control Panel</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#090d18;color:#eef2ff;font-family:Arial,sans-serif;padding:20px}
header{padding:22px 0}
h1{font-size:25px;margin:0}
header p{color:#8d9ab5}
.badge{display:inline-block;background:#142b25;color:#55e6a5;padding:7px 12px;border-radius:20px;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}
.card{background:#121a2b;border:1px solid #253149;border-radius:15px;padding:18px;margin-bottom:14px}
.label{color:#91a0bc;font-size:13px}
.value{font-size:25px;font-weight:bold;margin-top:10px;overflow-wrap:anywhere}
h2{font-size:18px;margin-top:0}
input{width:100%;padding:14px;border-radius:9px;border:1px solid #34415b;background:#0a1120;color:white;font-size:15px;margin:9px 0}
button{width:100%;padding:14px;border:0;border-radius:9px;background:#6d5dfc;color:white;font-weight:bold;font-size:15px;margin-top:9px}
button:disabled{opacity:.5}
.small{font-size:12px;color:#91a0bc;line-height:1.6}
#result{margin-top:15px;overflow-wrap:anywhere}
.code{font-size:27px;letter-spacing:4px;color:#65e6ac;font-weight:bold}
.session{padding:12px 0;border-bottom:1px solid #263149;font-size:14px}
footer{text-align:center;color:#71809e;font-size:12px;padding:20px}
@media(min-width:650px){body{max-width:760px;margin:auto}.grid{grid-template-columns:repeat(3,1fr)}}
</style>
</head>
<body>
<header>
<h1>EMMYHENZ</h1>
<p>WhatsApp Bot Control Panel</p>
<span class="badge">● LOCAL DASHBOARD</span>
</header>

<div class="grid">
<div class="card">
<div class="label">BOT STATUS</div>
<div class="value" id="status">Checking...</div>
</div>
<div class="card">
<div class="label">COMMANDS LOADED</div>
<div class="value" id="commands">--</div>
</div>
<div class="card">
<div class="label">ACTIVE SESSIONS</div>
<div class="value" id="sessionsCount">--</div>
</div>
</div>

<section class="card">
<h2>🔐 Pairing Mode</h2>
<p class="small">Only pair a WhatsApp account that you own or have explicit permission to link.</p>
<input id="number" type="tel" placeholder="International number e.g. 2348012345678">
<label class="small">
<input id="permission" type="checkbox" style="width:auto">
I own this account or have permission to link it.
</label>
<button id="pairButton" onclick="pairAccount()">Generate Pairing Code</button>
<div id="result"></div>
</section>

<section class="card">
<h2>📱 WhatsApp Sessions</h2>
<div id="sessionList" class="small">Loading sessions...</div>
</section>

<footer>EMMYHENZ CONTROL PANEL · V1.0</footer>

<script>
async function api(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) throw new Error(data.error || 'Request failed');

  return data;
}

async function refresh() {
  try {
    const data = await api('/api/status');

    document.getElementById('status').textContent =
      data.connected ? '🟢 ONLINE' : '🔴 OFFLINE';

    document.getElementById('commands').textContent =
      data.commands;

    document.getElementById('sessionsCount').textContent =
      data.sessions.length;

    const list = document.getElementById('sessionList');
    list.replaceChildren();

    if (!data.sessions.length) {
      list.textContent = 'No additional sessions yet.';
    } else {
      data.sessions.forEach(session => {
        const item = document.createElement('div');
        item.className = 'session';
        item.textContent = session.number + ' — ' + session.status;
        list.appendChild(item);
      });
    }
  } catch (error) {
    document.getElementById('status').textContent = 'Unavailable';
    console.error(error);
  }
}

async function pairAccount() {
  const number = document.getElementById('number').value.trim();
  const permission = document.getElementById('permission').checked;
  const button = document.getElementById('pairButton');
  const result = document.getElementById('result');

  result.textContent = '';

  if (!permission) {
    result.textContent = 'Please confirm that you have permission.';
    return;
  }

  if (!number) {
    result.textContent = 'Enter a phone number first.';
    return;
  }

  button.disabled = true;
  button.textContent = 'Generating...';

  try {
    const data = await api('/api/pair', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({number, permission})
    });

    result.replaceChildren();

    const heading = document.createElement('p');
    heading.textContent = 'Session status: ' + data.status;
    result.appendChild(heading);

    if (data.code) {
      const code = document.createElement('div');
      code.className = 'code';
      code.textContent = data.code;
      result.appendChild(code);

      const warning = document.createElement('p');
      warning.className = 'small';
      warning.textContent = 'Enter this code in WhatsApp → Linked Devices → Link with phone number. Never share it.';
      result.appendChild(warning);
    } else if (data.error) {
      result.appendChild(document.createTextNode(data.error));
    }

    refresh();
  } catch (error) {
    result.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = 'Generate Pairing Code';
  }
}

refresh();
setInterval(refresh, 5000);
</script>
</body>
</html>`;

function startDashboard({ sock, commands }) {
  getPassword();

  const server = http.createServer(async (req, res) => {
    if (!authorized(req)) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="EMMYHENZ Dashboard"',
        'Cache-Control': 'no-store'
      });
      return res.end('Authentication required');
    }

    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      return res.end(page);
    }

    if (req.method === 'GET' && req.url === '/api/status') {
      const sessions = listSessions();

      return send(res, 200, {
        connected: Boolean(sock.user),
        commands: commands.size,
        sessions
      });
    }

    if (req.method === 'POST' && req.url === '/api/pair') {
      try {
        const body = await readBody(req);
        const number = normalizeNumber(body.number);

        if (body.permission !== true) {
          return send(res, 403, {error: 'Permission confirmation required.'});
        }

        if (!number || number.length < 8 || number.length > 15) {
          return send(res, 400, {error: 'Enter a valid international phone number.'});
        }

        if (getSession(number)) {
          return send(res, 409, {error: 'A session for this number is already active.'});
        }

        const session = await createSession(number);

        if (session.status === 'error') {
          return send(res, 400, {
            status: session.status,
            error: session.error || 'Pairing failed.'
          });
        }

        return send(res, 200, {
          number: session.number,
          status: session.status,
          code: session.pairingCode
        });
      } catch (error) {
        return send(res, 400, {error: error.message});
      }
    }

    return send(res, 404, {error: 'Not found'});
  });

  server.listen(PORT, HOST, () => {
    console.log(`🌐 EMMYHENZ Dashboard: http://${HOST}:${PORT}`);
  });

  server.on('error', error => {
    console.error('Dashboard server error:', error.message);
  });

  return server;
}

module.exports = startDashboard;
