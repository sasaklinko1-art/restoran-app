import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";

export type StatusRezervacije =
  | "na_cekanju"
  | "potvrdjena"
  | "otkazana";

export interface Rezervacija {
  id: string;
  ime: string;
  telefon: string;
  email: string;
  datum: string;
  vreme: string;
  brojGostiju: number;
  napomena: string;
  sto: number;
  trajanjeMinuta: number;
  status: StatusRezervacije;
  kreirano: string;
}

export interface Jelo {
  id: string;
  naziv: string;
  opis: string;
  cena: number;
  kategorija: string;
  slika: string;
  aktivno: boolean;
  kreirano: string;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL nije podešen. Dodajte DATABASE_URL u .env.local i Vercel Environment Variables."
  );
}

const sql = neon(DATABASE_URL);

const BROJ_STOLOVA = 30;
const DEFAULT_TRAJANJE_MINUTA = 120;

function normalizujDatum(vrednost: unknown): string {
  if (vrednost instanceof Date) {
    return vrednost.toISOString().slice(0, 10);
  }

  return String(vrednost ?? "");
}

function normalizujVreme(vrednost: unknown): string {
  const tekst = String(vrednost ?? "");

  if (tekst.length >= 5) {
    return tekst.slice(0, 5);
  }

  return tekst;
}

function normalizujKreirano(vrednost: unknown): string {
  if (vrednost instanceof Date) {
    return vrednost.toISOString();
  }

  return String(vrednost ?? new Date().toISOString());
}

function mapRezervacija(red: any): Rezervacija {
  return {
    id: String(red.id),
    ime: String(red.ime),
    telefon: String(red.telefon),
    email: String(red.email ?? ""),
    datum: normalizujDatum(red.datum),
    vreme: normalizujVreme(red.vreme),
    brojGostiju: Number(red.broj_gostiju),
    napomena: String(red.napomena ?? ""),
    sto: Number(red.sto),
    trajanjeMinuta: Number(
      red.trajanje_minuta || DEFAULT_TRAJANJE_MINUTA
    ),
    status: red.status as StatusRezervacije,
    kreirano: normalizujKreirano(red.kreirano),
  };
}

function mapJelo(red: any): Jelo {
  return {
    id: String(red.id),
    naziv: String(red.naziv),
    opis: String(red.opis ?? ""),
    cena: Number(red.cena),
    kategorija: String(red.kategorija ?? ""),
    slika: String(red.slika ?? ""),
    aktivno: Boolean(red.aktivno),
    kreirano: normalizujKreirano(red.kreirano),
  };
}

/* =========================================
   REZERVACIJE
   ========================================= */

export async function ucitajSve(): Promise<Rezervacija[]> {
  const redovi = await sql`
    SELECT
      id,
      ime,
      telefon,
      email,
      datum,
      vreme,
      broj_gostiju,
      napomena,
      sto,
      trajanje_minuta,
      status,
      kreirano
    FROM rezervacije
    ORDER BY datum ASC, vreme ASC, kreirano DESC
  `;

  return redovi.map(mapRezervacija);
}

function datumIVreme(
  datum: string,
  vreme: string
): Date {
  return new Date(`${datum}T${vreme}:00`);
}

function rezervacijaPreklapanje(
  pocetakA: Date,
  krajA: Date,
  pocetakB: Date,
  krajB: Date
): boolean {
  return pocetakA < krajB && pocetakB < krajA;
}

async function jeStoSlobodan(
  datum: string,
  vreme: string,
  trajanjeMinuta: number,
  sto: number,
  izuzmiId?: string
): Promise<boolean> {
  const pocetak = datumIVreme(datum, vreme);
  const kraj = new Date(
    pocetak.getTime() + trajanjeMinuta * 60000
  );

  const redovi = await sql`
    SELECT
      id,
      datum,
      vreme,
      trajanje_minuta
    FROM rezervacije
    WHERE
      sto = ${sto}
      AND datum = ${datum}
      AND status <> 'otkazana'
      AND (${izuzmiId ?? null} IS NULL OR id <> ${izuzmiId ?? null})
  `;

  for (const red of redovi) {
    const drugiPocetak = datumIVreme(
      normalizujDatum(red.datum),
      normalizujVreme(red.vreme)
    );

    const drugoTrajanje = Number(
      red.trajanje_minuta || DEFAULT_TRAJANJE_MINUTA
    );

    const drugiKraj = new Date(
      drugiPocetak.getTime() + drugoTrajanje * 60000
    );

    if (
      rezervacijaPreklapanje(
        pocetak,
        kraj,
        drugiPocetak,
        drugiKraj
      )
    ) {
      return false;
    }
  }

  return true;
}

async function pronadjiSlobodanSto(
  datum: string,
  vreme: string,
  trajanjeMinuta: number
): Promise<number> {
  for (let sto = 1; sto <= BROJ_STOLOVA; sto++) {
    const slobodan = await jeStoSlobodan(
      datum,
      vreme,
      trajanjeMinuta,
      sto
    );

    if (slobodan) {
      return sto;
    }
  }

  return 0;
}

type NovaRezervacijaInput = {
  ime: string;
  telefon: string;
  email?: string;
  datum: string;
  vreme: string;
  brojGostiju: number;
  napomena?: string;
  sto?: number;
  trajanjeMinuta?: number;
};

export async function dodajRezervaciju(
  podaci: NovaRezervacijaInput
): Promise<Rezervacija> {
  const trajanjeMinuta = Number(
    podaci.trajanjeMinuta || DEFAULT_TRAJANJE_MINUTA
  );

  if (!Number.isFinite(trajanjeMinuta) || trajanjeMinuta <= 0) {
    throw new Error("Nevažeće trajanje rezervacije.");
  }

  let sto = Number(podaci.sto || 0);

  if (!sto) {
    sto = await pronadjiSlobodanSto(
      podaci.datum,
      podaci.vreme,
      trajanjeMinuta
    );
  } else {
    if (sto < 1 || sto > BROJ_STOLOVA) {
      throw new Error("Nevažeći broj stola.");
    }

    const slobodan = await jeStoSlobodan(
      podaci.datum,
      podaci.vreme,
      trajanjeMinuta,
      sto
    );

    if (!slobodan) {
      throw new Error("Taj sto je zauzet za ovaj termin.");
    }
  }

  if (!sto) {
    throw new Error(
      "Svi stolovi su zauzeti za ovaj termin."
    );
  }

  const id = randomUUID();

  try {
    const redovi = await sql`
      INSERT INTO rezervacije (
        id,
        ime,
        telefon,
        email,
        datum,
        vreme,
        broj_gostiju,
        napomena,
        sto,
        trajanje_minuta,
        status
      )
      VALUES (
        ${id},
        ${podaci.ime},
        ${podaci.telefon},
        ${podaci.email ?? ""},
        ${podaci.datum},
        ${podaci.vreme},
        ${podaci.brojGostiju},
        ${podaci.napomena ?? ""},
        ${sto},
        ${trajanjeMinuta},
        'na_cekanju'
      )
      RETURNING
        id,
        ime,
        telefon,
        email,
        datum,
        vreme,
        broj_gostiju,
        napomena,
        sto,
        trajanje_minuta,
        status,
        kreirano
    `;

    return mapRezervacija(redovi[0]);
  } catch (error: any) {
    const poruka = String(
      error?.constraint ?? ""
    );

    if (poruka.includes("nema_preklapanja_stola")) {
      throw new Error(
        "Taj sto je upravo zauzet. Pokušajte ponovo."
      );
    }

    throw error;
  }
}

export async function azurirajStatus(
  id: string,
  status: StatusRezervacije
): Promise<Rezervacija | null> {
  const redovi = await sql`
    UPDATE rezervacije
    SET status = ${status}
    WHERE id = ${id}
    RETURNING
      id,
      ime,
      telefon,
      email,
      datum,
      vreme,
      broj_gostiju,
      napomena,
      sto,
      trajanje_minuta,
      status,
      kreirano
  `;

  if (redovi.length === 0) {
    return null;
  }

  return mapRezervacija(redovi[0]);
}

export async function azurirajRezervaciju(
  id: string,
  izmene: Partial<{
    status: StatusRezervacije;
    sto: number;
    trajanjeMinuta: number;
  }>
): Promise<Rezervacija | null> {
  const postojece = await sql`
    SELECT
      id,
      ime,
      telefon,
      email,
      datum,
      vreme,
      broj_gostiju,
      napomena,
      sto,
      trajanje_minuta,
      status,
      kreirano
    FROM rezervacije
    WHERE id = ${id}
  `;

  if (postojece.length === 0) {
    return null;
  }

  const trenutno = mapRezervacija(postojece[0]);

  const noviSto =
    typeof izmene.sto === "number"
      ? izmene.sto
      : trenutno.sto;

  const novoTrajanje =
    typeof izmene.trajanjeMinuta === "number"
      ? izmene.trajanjeMinuta
      : trenutno.trajanjeMinuta;

  if (noviSto < 1 || noviSto > BROJ_STOLOVA) {
    return null;
  }

  const slobodan = await jeStoSlobodan(
    trenutno.datum,
    trenutno.vreme,
    novoTrajanje,
    noviSto,
    id
  );

  if (!slobodan) {
    return null;
  }

  try {
    const redovi = await sql`
      UPDATE rezervacije
      SET
        status = ${izmene.status ?? trenutno.status},
        sto = ${noviSto},
        trajanje_minuta = ${novoTrajanje}
      WHERE id = ${id}
      RETURNING
        id,
        ime,
        telefon,
        email,
        datum,
        vreme,
        broj_gostiju,
        napomena,
        sto,
        trajanje_minuta,
        status,
        kreirano
    `;

    if (redovi.length === 0) {
      return null;
    }

    return mapRezervacija(redovi[0]);
  } catch (error: any) {
    const poruka = String(
      error?.constraint ?? ""
    );

    if (poruka.includes("nema_preklapanja_stola")) {
      return null;
    }

    throw error;
  }
}

export async function obrisiRezervaciju(
  id: string
): Promise<boolean> {
  const redovi = await sql`
    DELETE FROM rezervacije
    WHERE id = ${id}
    RETURNING id
  `;

  return redovi.length > 0;
}

/* =========================================
   JELA
   ========================================= */

export async function ucitajSvaJela(): Promise<Jelo[]> {
  const redovi = await sql`
    SELECT
      id,
      naziv,
      opis,
      cena,
      kategorija,
      slika,
      aktivno,
      kreirano
    FROM jela
    ORDER BY kreirano DESC
  `;

  return redovi.map(mapJelo);
}

export async function dodajJelo(
  podaci: Omit<Jelo, "id" | "kreirano">
): Promise<Jelo> {
  const id = randomUUID();

  const redovi = await sql`
    INSERT INTO jela (
      id,
      naziv,
      opis,
      cena,
      kategorija,
      slika,
      aktivno
    )
    VALUES (
      ${id},
      ${podaci.naziv},
      ${podaci.opis},
      ${podaci.cena},
      ${podaci.kategorija},
      ${podaci.slika},
      ${podaci.aktivno}
    )
    RETURNING
      id,
      naziv,
      opis,
      cena,
      kategorija,
      slika,
      aktivno,
      kreirano
  `;

  return mapJelo(redovi[0]);
}

export async function izmeniJelo(
  id: string,
  podaci: Partial<Jelo>
): Promise<Jelo | null> {
  const postojece = await sql`
    SELECT
      id,
      naziv,
      opis,
      cena,
      kategorija,
      slika,
      aktivno,
      kreirano
    FROM jela
    WHERE id = ${id}
  `;

  if (postojece.length === 0) {
    return null;
  }

  const trenutno = mapJelo(postojece[0]);

  const naziv = podaci.naziv ?? trenutno.naziv;
  const opis = podaci.opis ?? trenutno.opis;
  const cena =
    typeof podaci.cena === "number"
      ? podaci.cena
      : trenutno.cena;
  const kategorija =
    podaci.kategorija ?? trenutno.kategorija;
  const slika = podaci.slika ?? trenutno.slika;
  const aktivno =
    typeof podaci.aktivno === "boolean"
      ? podaci.aktivno
      : trenutno.aktivno;

  const redovi = await sql`
    UPDATE jela
    SET
      naziv = ${naziv},
      opis = ${opis},
      cena = ${cena},
      kategorija = ${kategorija},
      slika = ${slika},
      aktivno = ${aktivno}
    WHERE id = ${id}
    RETURNING
      id,
      naziv,
      opis,
      cena,
      kategorija,
      slika,
      aktivno,
      kreirano
  `;

  if (redovi.length === 0) {
    return null;
  }

  return mapJelo(redovi[0]);
}

export async function obrisiJelo(
  id: string
): Promise<boolean> {
  const redovi = await sql`
    DELETE FROM jela
    WHERE id = ${id}
    RETURNING id
  `;

  return redovi.length > 0;
}