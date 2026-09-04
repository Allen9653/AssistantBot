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

Službeni identitet je `AssistantBot`, a logo se servira sa `/assets/AssistantBot_logo.png`.
Fajl je smješten u `public/assets/AssistantBot_logo.png`.
Promjena imena ili logotipa dozvoljena je samo kada provjereni subscription sadrži `paidMonths >= 6`; podatak mora doći iz autentifikovanog payment sistema, ne iz javnog webhook payload-a.
**AssistantBot** je zvanični uslužni bot predložak u vlasništvu kompanije **B&H Assistant d.o.o. Zenica**. Kreiran je sa primarnim ciljem da vođenjem kroz proces vodi korisnika kroz odabir usluge, definisanje termina i potvrdu podataka. Prilagođen specifičnim govornim tonovima, dijalektima i višekanalnoj pristupačnosti, bot služi kao napredno rješenje za digitalizaciju poslovanja.

## Vlasništvo i Korporativne Informacije
* **Naziv firme:** B&H Assistant d.o.o. Zenica
* **Sjedište:** Bulevar Ezhera Eze Arnautovića br. 8, 72000 Zenica, Bosna i Hercegovina
* **Zvanični web portal:** [www.bh-assistant.ba](https://www.bh-assistant.ba)
* **Kontakt email:** info@bh-assistant.ba

## Ključne Karakteristike

* **Višejezičnost i Skript-detekcija:** Sadrži naprednu logiku za prepoznavanje ćiriličnog i latiničnog pisma te automatsku bilingvalnu podršku.
* **Zaštita i Filtriranje Upita:** Dizajniran s ugrađenom logikom filtriranja upita koja pomaže zanatlijama i uslužnim djelatnostima u usklađenosti s regulatornim okvirima (izbjegavanje problema "cijena na upit").
* **Interaktivni Tok Korisnika:** Vodi krajnjeg korisnika kroz korak-po-korak odabir željenih usluga, rezervaciju termina i konačnu verifikaciju unesenih podataka.
* **Višekanalna Pristupačnost:** Arhitektura spremna za integraciju na različite digitalne kanale i platforme.

## Tehnološka Osnova

* **Backend:** Node.js / JavaScript (`server.js` v1.2)
* **Arhitektura:** Prilagođeno za serverless i cloud okruženja
* **Licenca:** Projekat je pokriven **MIT licencom**. Sva prava zadržava B&H Assistant d.o.o.

## Pokretanje i Instalacija

Za lokalno pokretanje projekta u razvojnom okruženju:

1. Klonirajte repozitorij:
   ```bash
   git clone [https://github.com/Allen9653/AssistantBot.git](https://github.com/Allen9653/AssistantBot.git)
