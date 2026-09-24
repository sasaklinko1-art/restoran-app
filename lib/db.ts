import fs from "fs";
import path from "path";

export type StatusRezervacije = "na_cekanju" | "potvrdjena" | "otkazana";

export interface Rezervacija {
  id: string;
  ime: string;
  telefon: string;
  email: string;
  datum: string; // YYYY-MM-DD
  vreme: string; // HH:MM
  brojGostiju: number;
  napomena: string;
  sto: number;
  trajanjeMinuta: number;
  status: StatusRezervacije;
  kreirano: string; // ISO datum
}

const BROJ_STOLOVA = 30;
const DEFAULT_TRAJANJE_MINUTA = 120;

const DATA_PATH = path.join(process.cwd(), "data", "rezervacije.json");

function osiguraj(): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]", "utf-8");
}

function cryptoRandomId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

function parseDatumIVreme(datum: string, vreme: string): Date {
  return new Date(`${datum}T${vreme}:00`);
}

function preklapaSe(
  aPocetak: Date,
  aKraj: Date,
  bPocetak: Date,
  bKraj: Date
): boolean {
  return aPocetak < bKraj && bPocetak < aKraj;
}

function jeStoSlobodan(
  sve: Rezervacija[],
  datum: string,
  vreme: string,
  trajanjeMinuta: number,
  sto: number,
  izuzmiId?: string
): boolean {
  const pocetak = parseDatumIVreme(datum, vreme);
  const kraj = new Date(pocetak.getTime() + trajanjeMinuta * 60000);

  return !sve.some((r) => {
    if (izuzmiId && r.id === izuzmiId) return false;
    if (r.sto !== sto) return false;

    const rPocetak = parseDatumIVreme(r.datum, r.vreme);
    const rKraj = new Date(
      rPocetak.getTime() +
        (r.trajanjeMinuta || DEFAULT_TRAJANJE_MINUTA) * 60000
    );

    return preklapaSe(pocetak, kraj, rPocetak, rKraj);
  });
}

function pronadjiSlobodanSto(
  sve: Rezervacija[],
  datum: string,
  vreme: string,
  trajanjeMinuta: number
): number {
  for (let sto = 1; sto <= BROJ_STOLOVA; sto++) {
    if (jeStoSlobodan(sve, datum, vreme, trajanjeMinuta, sto)) {
      return sto;
    }
  }
  return 0;
}

export function ucitajSve(): Rezervacija[] {
  osiguraj();
  const sirovo = fs.readFileSync(DATA_PATH, "utf-8");

  try {
    const parsed = JSON.parse(sirovo) as Array<Partial<Rezervacija>>;

    return parsed.map((r) => ({
      id: String(r.id || cryptoRandomId()),
      ime: String(r.ime || ""),
      telefon: String(r.telefon || ""),
      email: String(r.email || ""),
      datum: String(r.datum || ""),
      vreme: String(r.vreme || ""),
      brojGostiju: Number(r.brojGostiju || 1),
      napomena: String(r.napomena || ""),
      sto: Number(r.sto || 0),
      trajanjeMinuta: Number(r.trajanjeMinuta || DEFAULT_TRAJANJE_MINUTA),
      status: (r.status as StatusRezervacije) || "na_cekanju",
      kreirano: String(r.kreirano || new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

function sacuvajSve(rezervacije: Rezervacija[]): void {
  osiguraj();
  fs.writeFileSync(DATA_PATH, JSON.stringify(rezervacije, null, 2), "utf-8");
}

type NovaRezervacijaInput = Omit<
  Rezervacija,
  "id" | "status" | "kreirano" | "sto" | "trajanjeMinuta"
> & {
  sto?: number;
  trajanjeMinuta?: number;
};

export function dodajRezervaciju(
  podaci: NovaRezervacijaInput
): Rezervacija {
  const sve = ucitajSve();

  const trajanjeMinuta = Number(
    podaci.trajanjeMinuta || DEFAULT_TRAJANJE_MINUTA
  );

  let sto = Number(podaci.sto || 0);

  if (sto) {
    if (
      sto < 1 ||
      sto > BROJ_STOLOVA ||
      !jeStoSlobodan(
        sve,
        podaci.datum,
        podaci.vreme,
        trajanjeMinuta,
        sto
      )
    ) {
      throw new Error("Taj sto je zauzet za ovaj termin.");
    }
  } else {
    sto = pronadjiSlobodanSto(
      sve,
      podaci.datum,
      podaci.vreme,
      trajanjeMinuta
    );
  }

  if (!sto) {
    throw new Error("Svi stolovi su zauzeti za ovaj termin.");
  }

  const nova: Rezervacija = {
    ...podaci,
    id: cryptoRandomId(),
    sto,
    trajanjeMinuta,
    status: "na_cekanju",
    kreirano: new Date().toISOString(),
  };

  sve.unshift(nova);
  sacuvajSve(sve);
  return nova;
}

export function azurirajStatus(
  id: string,
  status: StatusRezervacije
): Rezervacija | null {
  const sve = ucitajSve();
  const idx = sve.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  sve[idx].status = status;
  sacuvajSve(sve);
  return sve[idx];
}

export function azurirajRezervaciju(
  id: string,
  izmene: Partial<Pick<Rezervacija, "status" | "sto" | "trajanjeMinuta">>
): Rezervacija | null {
  const sve = ucitajSve();
  const idx = sve.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const trenutna = sve[idx];

  const noviSto =
    typeof izmene.sto === "number" ? izmene.sto : trenutna.sto;

  const novoTrajanje =
    typeof izmene.trajanjeMinuta === "number"
      ? izmene.trajanjeMinuta
      : trenutna.trajanjeMinuta || DEFAULT_TRAJANJE_MINUTA;

  if (noviSto) {
    if (
      noviSto < 1 ||
      noviSto > BROJ_STOLOVA ||
      !jeStoSlobodan(
        sve,
        trenutna.datum,
        trenutna.vreme,
        novoTrajanje,
        noviSto,
        id
      )
    ) {
      return null;
    }
  }

  sve[idx] = {
    ...trenutna,
    ...izmene,
    sto: noviSto,
    trajanjeMinuta: novoTrajanje,
  };

  sacuvajSve(sve);
  return sve[idx];
}

export function obrisiRezervaciju(id: string): boolean {
  const sve = ucitajSve();
  const preduzeto = sve.length;
  const preostalo = sve.filter((r) => r.id !== id);
  sacuvajSve(preostalo);
  return preostalo.length < preduzeto;
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

const JELA_PATH = path.join(process.cwd(), "data", "jela.json");

function osigurajJela(): void {
  const dir = path.dirname(JELA_PATH);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(JELA_PATH)) {
    fs.writeFileSync(JELA_PATH, "[]", "utf-8");
  }
}

export function ucitajSvaJela(): Jelo[] {
  osigurajJela();

  const sirovo = fs.readFileSync(JELA_PATH, "utf-8");

  try {
    return JSON.parse(sirovo) as Jelo[];
  } catch {
    return [];
  }
}

function sacuvajSvaJela(jela: Jelo[]): void {
  osigurajJela();

  fs.writeFileSync(
    JELA_PATH,
    JSON.stringify(jela, null, 2),
    "utf-8"
  );
}

export function dodajJelo(
  podaci: Omit<Jelo, "id" | "kreirano">
): Jelo {
  const sva = ucitajSvaJela();

  const novo: Jelo = {
    ...podaci,
    id: cryptoRandomId(),
    kreirano: new Date().toISOString(),
  };

  sva.unshift(novo);
  sacuvajSvaJela(sva);

  return novo;
}

export function izmeniJelo(
  id: string,
  podaci: Partial<Jelo>
): Jelo | null {
  const sva = ucitajSvaJela();

  const index = sva.findIndex((j) => j.id === id);

  if (index === -1) return null;

  sva[index] = {
    ...sva[index],
    ...podaci,
  };

  sacuvajSvaJela(sva);

  return sva[index];
}

export function obrisiJelo(id: string): boolean {
  const sva = ucitajSvaJela();

  const novo = sva.filter((j) => j.id !== id);

  sacuvajSvaJela(novo);

  return novo.length < sva.length;
}