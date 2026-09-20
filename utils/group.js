const {
  areJidsSameUser,
  jidNormalizedUser
} = require('@whiskeysockets/baileys');

function isGroup(jid) {
  return jid && jid.endsWith('@g.us');
}

function getTargetJid(msg, args = []) {
  const context =
    msg.message?.extendedTextMessage?.contextInfo ||
    msg.message?.imageMessage?.contextInfo ||
    msg.message?.videoMessage?.contextInfo ||
    {};

  const mentioned = context.mentionedJid;

  if (mentioned?.length) {
    return mentioned[0];
  }

  if (context.participant) {
    return context.participant;
  }

  const number = args[0]?.replace(/\D/g, '');

  if (number) {
    return `${number}@s.whatsapp.net`;
  }

  return null;
}

async function getGroupData(sock, jid) {
  return await sock.groupMetadata(jid);
}

function participantIsAdmin(participant) {
  return (
    participant?.admin === 'admin' ||
    participant?.admin === 'superadmin' ||
    participant?.isAdmin === true ||
    participant?.isSuperAdmin === true
  );
}

function findParticipant(metadata, jid) {
  if (!jid) return null;

  return metadata.participants.find(p => {
    if (areJidsSameUser(p.id, jid)) return true;

    if (p.phoneNumber && areJidsSameUser(p.phoneNumber, jid)) {
      return true;
    }

    if (p.lid && areJidsSameUser(p.lid, jid)) {
      return true;
    }

    return false;
  });
}

function botIsAdmin(metadata, sock) {
  const me = sock.user?.id;
  const meLid = sock.user?.lid;

  let participant = findParticipant(metadata, me);

  if (!participant && meLid) {
    participant = findParticipant(metadata, meLid);
  }

  return participantIsAdmin(participant);
}

function userIsAdmin(metadata, userJid) {
  const participant = findParticipant(metadata, userJid);
  return participantIsAdmin(participant);
}

async function requireGroup(sock, sender) {
  if (!isGroup(sender)) {
    await sock.sendMessage(sender, {
      text: '❌ This command can only be used in a group.'
    });

    return false;
  }

  return true;
}

async function requireBotAdmin(sock, sender) {
  try {
    const metadata = await getGroupData(sock, sender);

    if (!botIsAdmin(metadata, sock)) {
      await sock.sendMessage(sender, {
        text: '❌ I need to be a group admin to use this command.'
      });

      return null;
    }

    return metadata;
  } catch (error) {
    console.error('Admin check error:', error.message);

    await sock.sendMessage(sender, {
      text: '❌ Could not check the bot admin status.'
    });

    return null;
  }
}

module.exports = {
  isGroup,
  getTargetJid,
  getGroupData,
  botIsAdmin,
  userIsAdmin,
  requireGroup,
  requireBotAdmin
};
