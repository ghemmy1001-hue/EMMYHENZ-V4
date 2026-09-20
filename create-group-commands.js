const fs = require('fs');
const path = require('path');

const commands = {

ban: `
const g = require('../utils/group');

module.exports = {
  name: 'ban',
  description: 'Remove a member from the group',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: 'Usage: .ban @user or reply to their message.'
      });
    }

    await sock.groupParticipantsUpdate(sender, [target], 'remove');

    await sock.sendMessage(sender, {
      text: '✅ Member removed from the group.'
    });
  }
};
`,

unban: `
const g = require('../utils/group');

module.exports = {
  name: 'unban',
  description: 'Explain WhatsApp ban limitations',

  async execute(sock, sender) {
    await sock.sendMessage(sender, {
      text: 'ℹ️ WhatsApp does not provide a separate bot-managed ban list. A removed member can be added again with .add if allowed.'
    });
  }
};
`,

kick: `
const g = require('../utils/group');

module.exports = {
  name: 'kick',
  description: 'Remove a member',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: 'Usage: .kick @user or reply to their message.'
      });
    }

    await sock.groupParticipantsUpdate(sender, [target], 'remove');

    await sock.sendMessage(sender, {
      text: '👢 Member removed.'
    });
  }
};
`,

promote: `
const g = require('../utils/group');

module.exports = {
  name: 'promote',
  description: 'Promote a member to admin',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: 'Usage: .promote @user'
      });
    }

    await sock.groupParticipantsUpdate(sender, [target], 'promote');

    await sock.sendMessage(sender, {
      text: '👑 Member promoted to admin.'
    });
  }
};
`,

demote: `
const g = require('../utils/group');

module.exports = {
  name: 'demote',
  description: 'Remove admin privileges',

  async execute(sock, sender, args, msg) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const target = g.getTargetJid(msg, args);

    if (!target) {
      return sock.sendMessage(sender, {
        text: 'Usage: .demote @user'
      });
    }

    await sock.groupParticipantsUpdate(sender, [target], 'demote');

    await sock.sendMessage(sender, {
      text: '⬇️ Admin privileges removed.'
    });
  }
};
`,

add: `
const g = require('../utils/group');

module.exports = {
  name: 'add',
  description: 'Add a member to the group',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const number = args[0] ? args[0].replace(/\\D/g, '') : '';

    if (!number) {
      return sock.sendMessage(sender, {
        text: 'Usage: .add 2348012345678'
      });
    }

    const target = number + '@s.whatsapp.net';

    await sock.groupParticipantsUpdate(sender, [target], 'add');

    await sock.sendMessage(sender, {
      text: '✅ Add request processed.'
    });
  }
};
`,

tagall: `
const g = require('../utils/group');

module.exports = {
  name: 'tagall',
  description: 'Mention all group members',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.getGroupData(sock, sender);
    const text = args.join(' ') || '📢 Attention everyone!';

    const mentions = metadata.participants.map(function(p) {
      return p.id;
    });

    await sock.sendMessage(sender, {
      text: text,
      mentions: mentions
    });
  }
};
`,

hidetag: `
const g = require('../utils/group');

module.exports = {
  name: 'hidetag',
  description: 'Mention everyone without listing names',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.getGroupData(sock, sender);
    const text = args.join(' ') || '📢 Attention everyone!';

    const mentions = metadata.participants.map(function(p) {
      return p.id;
    });

    await sock.sendMessage(sender, {
      text: text,
      mentions: mentions
    });
  }
};
`,

tagadmins: `
const g = require('../utils/group');

module.exports = {
  name: 'tagadmins',
  description: 'Mention group admins',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.getGroupData(sock, sender);

    const admins = metadata.participants.filter(function(p) {
      return p.admin;
    });

    const mentions = admins.map(function(p) {
      return p.id;
    });

    const text = args.join(' ') || '👑 Attention admins!';

    await sock.sendMessage(sender, {
      text: text,
      mentions: mentions
    });
  }
};
`,

staff: `
const g = require('../utils/group');

module.exports = {
  name: 'staff',
  description: 'List group administrators',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.getGroupData(sock, sender);

    const admins = metadata.participants.filter(function(p) {
      return p.admin;
    });

    if (!admins.length) {
      return sock.sendMessage(sender, {
        text: 'No admins found.'
      });
    }

    const lines = admins.map(function(p, i) {
      return (i + 1) + '. @' + p.id.split('@')[0];
    });

    await sock.sendMessage(sender, {
      text: '👑 GROUP ADMINS\\n\\n' + lines.join('\\n'),
      mentions: admins.map(function(p) {
        return p.id;
      })
    });
  }
};
`,

groupinfo: `
const g = require('../utils/group');

module.exports = {
  name: 'groupinfo',
  description: 'Show group information',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.getGroupData(sock, sender);

    await sock.sendMessage(sender, {
      text:
        '👥 GROUP INFORMATION\\n\\n' +
        '📛 Name: ' + metadata.subject + '\\n' +
        '👤 Members: ' + metadata.participants.length + '\\n' +
        '🆔 JID: ' + sender + '\\n\\n' +
        '📝 Description:\\n' +
        (metadata.desc || 'No description')
    });
  }
};
`,

setname: `
const g = require('../utils/group');

module.exports = {
  name: 'setname',
  description: 'Change group name',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const name = args.join(' ').trim();

    if (!name) {
      return sock.sendMessage(sender, {
        text: 'Usage: .setname New Group Name'
      });
    }

    await sock.groupUpdateSubject(sender, name);

    await sock.sendMessage(sender, {
      text: '✅ Group name updated.'
    });
  }
};
`,

setdesc: `
const g = require('../utils/group');

module.exports = {
  name: 'setdesc',
  description: 'Change group description',

  async execute(sock, sender, args) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    const desc = args.join(' ').trim();

    if (!desc) {
      return sock.sendMessage(sender, {
        text: 'Usage: .setdesc New description'
      });
    }

    await sock.groupUpdateDescription(sender, desc);

    await sock.sendMessage(sender, {
      text: '✅ Group description updated.'
    });
  }
};
`,

revoke: `
const g = require('../utils/group');

module.exports = {
  name: 'revoke',
  description: 'Reset the group invite link',

  async execute(sock, sender) {
    if (!await g.requireGroup(sock, sender)) return;

    const metadata = await g.requireBotAdmin(sock, sender);
    if (!metadata) return;

    await sock.groupRevokeInvite(sender);

    await sock.sendMessage(sender, {
      text: '🔐 Group invite link has been reset.'
    });
  }
};
`
};

const dir = path.join(__dirname, 'commands');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const [name, code] of Object.entries(commands)) {
  const file = path.join(dir, name + '.js');

  fs.writeFileSync(file, code.trim() + '\\n');

  console.log('✅ Created .' + name);
}

console.log('');
console.log('🚀 ' + Object.keys(commands).length + ' group commands created.');
