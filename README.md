# Kod Stare Lipe — Restoran sa online rezervacijama

Next.js 15 (App Router + TypeScript + Tailwind CSS) aplikacija za restoran:
javni sajt sa menijem i formularom za rezervacije, plus zaštićeni admin
panel za upravljanje rezervacijama i jelovnikom.

## Pokretanje

1. Instalirajte zavisnosti:

   ```bash
   npm install
   ```

2. Podesite admin lozinku — kopirajte `.env.local.example` u `.env.local`
   i izmenite vrednosti:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   ADMIN_PASSWORD=vasa-tajna-lozinka
   SESSION_SECRET=neka-nasumicna-duga-vrednost
   ```

3. Pokrenite razvojni server:

   ```bash
   npm run dev
   ```

4. Otvorite [http://localhost:3000](http://localhost:3000) za javni sajt i
   [http://localhost:3000/admin](http://localhost:3000/admin) za admin
   panel (prijava lozinkom iz `.env.local`).

## Struktura

- `app/page.tsx` — početna stranica restorana
- `app/meni/page.tsx` — stranica sa menijem
- `app/rezervacija/page.tsx` — javni formular za rezervaciju
- `app/admin/login/page.tsx` — prijava za admin panel
- `app/admin/(zasticeno)/` — zaštićeni deo admin panela: `page.tsx` (lista
  rezervacija, potvrda/otkazivanje/brisanje) i `meni/page.tsx` (upravljanje
  jelovnikom — dodavanje, izmena, aktivacija/deaktivacija, brisanje jela)
- `app/api/rezervacije/` — API rute za kreiranje, listanje, izmenu i
  brisanje rezervacija
- `app/api/jela/` — API rute za jelovnik (`GET`/`POST /api/jela`,
  `PATCH`/`DELETE /api/jela/[id]`)
- `app/api/auth/` — API ruta za prijavu/odjavu admina
- `lib/db.ts` — sloj za skladištenje podataka (JSON fajlovi
  `data/rezervacije.json` i `data/jela.json`)
- `lib/auth.ts` — provera lozinke i potpisivanje sesije (HMAC kolačić)
- `middleware.ts` — štiti `/admin` rute i admin API pozive

## Napomene

- Podaci o rezervacijama se čuvaju u `data/rezervacije.json` — jednostavno
  rešenje bez potrebe za bazom podataka, pogodno za manji restoran ili
  demo. Za produkciju sa više paralelnih korisnika preporučuje se prelazak
  na pravu bazu (npr. PostgreSQL sa Prisma ORM-om).
- Admin sesija se čuva u `httpOnly` kolačiću potpisanom HMAC-om — nema
  potrebe za dodatnom bazom korisnika, ali postoji samo jedan admin nalog
  (lozinka iz env promenljive).
- Za produkcijsko okruženje obavezno postavite jaku, nasumičnu vrednost za
  `SESSION_SECRET` i `ADMIN_PASSWORD`, i hostujte preko HTTPS-a.
- Jelovnik (`/admin/meni`) čuva podatke u `data/jela.json`, unapred popunjen
  sa istim jelima koja su ranije bila statična na javnoj stranici menija —
  slobodno ih izmenite ili obrišite. Polje za sliku je URL (npr. link ka
  slici na vašem hostingu ili CDN-u), ne upload fajla — javna stranica
  menija prikazuje sliku samo ako je uneta, i prikazuje samo jela
  označena kao aktivna.
