# AssistantBot

Express aplikacija za simulaciju B&H Assistant Viber webhooka.

## Pokretanje

```bash
npm start
```

Server je dostupan na `http://localhost:3000`, a webhook na `POST /webhooks/viber/`.
Poruka može biti poslata kao `{ "text": "..." }` ili kao Viber payload `{ "message": { "text": "..." } }`.

Tekstualni engine u `src/utils/textEngine.js` prepoznaje ćirilicu, pravilno transliteriše `dž`, `lj`, `nj` i `š`, te normalizuje latinicu za pretragu.

## Branding

Službeni identitet je `AssistantBot`, a logo se servira sa `/assets/assistantbot-logo.png`.
Fajl treba biti smješten u `public/assets/assistantbot-logo.png`.
Promjena imena ili logotipa dozvoljena je samo kada provjereni subscription sadrži `paidMonths >= 6`; podatak mora doći iz autentifikovanog payment sistema, ne iz javnog webhook payload-a.
