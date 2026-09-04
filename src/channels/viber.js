const express = require('express');
const { isCyrillic, toCyrillic, normalizeLatin } = require('../utils/textEngine');
const { officialBranding } = require('../config/branding');

const router = express.Router();

function createReply(incomingMessage) {
  const message = String(incomingMessage || 'kako radi sistem');
  const normalizedMessage = normalizeLatin(message);
  let reply;

  if (normalizedMessage.includes('cijen') || normalizedMessage.includes('koliko') || message.includes('цијен') || message.includes('колик')) {
    reply = 'Pozdrav! Cijene se ne mogu dati napamet jer se svaka usluga procjenjuje na terenu. Napišite nam šta vam treba, a majstor će vam se javiti s ponudom!';
  } else if (normalizedMessage.includes('kako radi') || normalizedMessage.includes('podaci') || normalizedMessage.includes('prikuplj') || message.includes('како ради') || message.includes('подац') || message.includes('прикупљ')) {
    reply = 'B&H Assistant radi jednostavno: 1. Kada pošaljete poruku, bot je automatski čuva. 2. Podaci (vaš broj i upit) šalju se direktno u SMS/Viber sandučić majstora i na njegovu email adresu info@... 3. Majstor pregleda poruku i zove vas kad završi radove na terenu!';
  } else if (normalizedMessage.includes('spoj') || normalizedMessage.includes('broj') || normalizedMessage.includes('email') || message.includes('спој') || message.includes('број') || message.includes('имејл')) {
    reply = 'Povezivanje je lako: Majstor ne instalira nikakve teške programe. Naš tim uz vašu saglasnost poveže vaš službeni Viber/WhatsApp broj i poslovni email (npr. info@vašobrt.ba) sa našim serverom www.bh-assistant.ba za samo 5 minuta!';
  } else {
    reply = 'Hvala vam na poruci! B&H Assistant je zabilježio vaš upit u ime našeg majstora. Javit ćemo vam se u najkraćem roku.';
  }

  return isCyrillic(message) ? toCyrillic(reply) : reply;
}

router.post('/', (req, res) => {
  const incomingMessage = req.body?.message?.text || req.body?.text || req.body?.message;
  res.json({
    status: 'success',
    company: 'B&H Assistant d.o.o.',
    web: 'www.bh-assistant.ba',
    contact: 'info@bh-assistant.ba',
    branding: officialBranding,
    reply: createReply(incomingMessage)
  });
});

module.exports = router;
