const http = require('http');

// Funkcija za prepoznavanje pisma (Latinica / Ćirilica)
function isCyrillic(text) {
  const cyrillicPattern = /[а-щођжћчџшњељ]/i;
  return cyrillicPattern.test(text);
}

function toCyrillic(text) {
  const latinToCyrillic = {
    'A':'А', 'a':'а', 'B':'Б', 'b':'б', 'V':'В', 'v':'в', 'G':'Г', 'g':'г', 'D':'Д', 'd':'д',
    'Đ':'Ђ', 'đ':'ђ', 'E':'Е', 'e':'е', 'Ž':'Ж', 'ž':'ж', 'Z':'З', 'z':'з', 'I':'И', 'i':'и',
    'J':'Ј', 'j':'ј', 'K':'К', 'k':'к', 'L':'Л', 'l':'л', 'M':'М', 'm':'м',
    'N':'Н', 'n':'н', 'O':'О', 'o':'о', 'P':'П', 'p':'п', 'R':'Р', 'r':'р',
    'S':'С', 's':'с', 'Š':'Ш', 'š':'š', 'T':'Т', 't':'т', 'U':'У', 'u':'у', 
    'F':'Ф', 'f':'ф', 'H':'Х', 'h':'х', 'C':'Ц', 'c':'ц', 'Č':'Ч', 'č':'ч', 'Ć':'Ћ', 'ć':'ћ'
  };
  return text.split('').map(char => latinToCyrillic[char] || char).join('');
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      // Ovdje simuliramo dolaznu poruku od klijenta
      let incomingMessage = "kako radi sistem"; 
      let msgLower = incomingMessage.toLowerCase();
      let baseReply = "";

      // 1. Upit o cijenama (Zaštita od inspekcije)
      if (msgLower.includes('cijen') || msgLower.includes('koliko')) {
        baseReply = "Pozdrav! Cijene se ne mogu dati napamet jer se svaka usluga procjenjuje na terenu. Napišite nam šta vam treba, a majstor će vam se javiti s ponudom!";
      } 
      // 2. Objašnjenje kako bot prikuplja i dostavlja podatke
      else if (msgLower.includes('kako radi') || msgLower.includes('podaci') || msgLower.includes('prikuplj')) {
        baseReply = "B&H Assistant radi jednostavno: 1. Kada pošaljete poruku, bot je automatski čuva. 2. Podaci (vaš broj i upit) šalju se direktno u SMS/Viber sandučić majstora i na njegovu email adresu info@... 3. Majstor pregleda poruku i zove vas kad završi radove na terenu!";
      } 
      // 3. Uputstvo kako majstor spaja email i mobitel
      else if (msgLower.includes('spoj') || msgLower.includes('broj') || msgLower.includes('email')) {
        baseReply = "Povezivanje je lako: Majstor ne instalira nikakve teške programe. Naš tim uz vašu saglasnost poveže vaš službeni Viber/WhatsApp broj i poslovni email (npr. info@vašobrt.ba) sa našim serverom www.bh-assistant.ba za samo 5 minuta!";
      } 
      // 4. Standardni pozdrav i usmjeravanje
      else {
        baseReply = "Hvala vam na poruci! B&H Assistant je zabilježio vaš upit u ime našeg majstora. Javit ćemo vam se u najkraćem roku.";
      }

      let finalReply = isCyrillic(incomingMessage) ? toCyrillic(baseReply) : baseReply;

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ 
        status: 'success', 
        company: "B&H Assistant d.o.o.",
        web: "www.bh-assistant.ba",
        contact: "info@bh-assistant.ba",
        reply: finalReply 
      }));
    });
  } else {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ status: 'active', system: 'B&H Assistant Service Bot v1.2' }));
  }
});

server.listen(3000, () => console.log('B&H Assistant Server pokrenut na portu 3000'));