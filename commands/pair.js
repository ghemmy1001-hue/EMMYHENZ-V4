'use strict';

const {
  createSession,
  normalizeNumber
} = require('../utils/sessionManager');


module.exports = {

  name: 'pair',

  description:
    'Pair another WhatsApp number',


  async execute(
    sock,
    sender,
    args,
    msg,
    context
  ) {

    /*
    |--------------------------------------------------------------------------
    | NUMBER SUPPLIED
    |--------------------------------------------------------------------------
    |
    | .pair 2348012345678
    |
    */

    const rawNumber =
      args?.join(' ') || '';

    const number =
      normalizeNumber(
        rawNumber
      );


    /*
    |--------------------------------------------------------------------------
    | NO NUMBER
    |--------------------------------------------------------------------------
    |
    | .pair
    |
    | Ask for the number.
    |--------------------------------------------------------------------------
    */

    if (!number) {

      await sock.sendMessage(
        sender,
        {
          text:
`╔══════════════════════════════╗
║       🔐 PAIR WHATSAPP       ║
╠══════════════════════════════╣
║                              ║
║ Send the WhatsApp number     ║
║ you want to pair.            ║
║                              ║
║ Example:                     ║
║ 2348012345678                ║
║                              ║
║ 🌍 International format      ║
║ ❌ No +                      ║
║ ❌ No spaces                 ║
║ ❌ No dashes                 ║
╚══════════════════════════════╝`
        }
      );


      /*
      |--------------------------------------------------------------------------
      | SAVE PENDING REQUEST
      |--------------------------------------------------------------------------
      */

      if (
        context?.pendingPairing
      ) {

        context.pendingPairing.set(
          sender,
          true
        );

      }

      return;
    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATE NUMBER
    |--------------------------------------------------------------------------
    */

    if (
      number.length < 8 ||
      number.length > 15
    ) {

      await sock.sendMessage(
        sender,
        {
          text:
`❌ Invalid WhatsApp number.

Example:
2348012345678`
        }
      );

      return;
    }


    /*
    |--------------------------------------------------------------------------
    | START PAIRING
    |--------------------------------------------------------------------------
    */

    if (
      typeof context?.beginPairing ===
      'function'
    ) {

      await context.beginPairing(
        sock,
        sender,
        number
      );

      return;
    }


    /*
    |--------------------------------------------------------------------------
    | FALLBACK
    |--------------------------------------------------------------------------
    */

    try {

      await sock.sendMessage(
        sender,
        {
          text:
`⏳ Starting pairing...

📱 Number: ${number}

Please wait...`
        }
      );


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
              sender,
              {
                text:
`🔐 PAIRING CODE

${session.pairingCode}

📱 ${number}

WhatsApp
→ Linked Devices
→ Link a device
→ Link with phone number`
              }
            );
          }


          if (
            event === 'connected'
          ) {

            await sock.sendMessage(
              sender,
              {
                text:
`🟢 CONNECTED

📱 ${number}

WhatsApp session connected successfully.`
              }
            );
          }


          if (
            event === 'error'
          ) {

            await sock.sendMessage(
              sender,
              {
                text:
`❌ Pairing failed.

📱 ${number}

${session.error || 'Unknown error'}`
              }
            );
          }

        }
      );

    } catch (error) {

      await sock.sendMessage(
        sender,
        {
          text:
`❌ Could not start pairing.

${error.message || 'Unknown error'}`
        }
      );

    }

  }

};
