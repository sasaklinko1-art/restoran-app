"use client";

import { useMemo, useState } from "react";
import type { Jelo } from "@/lib/db";

type NovoJeloForma = {
  naziv: string;
  opis: string;
  cena: string;
  kategorija: string;
  slika: string;
};

const PRAZNA_FORMA: NovoJeloForma = {
  naziv: "",
  opis: "",
  cena: "",
  kategorija: "",
  slika: "",
};

export default function MeniAdminUpravljanje({
  pocetnaJela,
}: {
  pocetnaJela: Jelo[];
}) {
  const [jela, setJela] = useState<Jelo[]>(pocetnaJela);
  const [forma, setForma] = useState<NovoJeloForma>(PRAZNA_FORMA);
  const [greska, setGreska] = useState("");
  const [slanje, setSlanje] = useState(false);
  const [idKojiSeUredjuje, setIdKojiSeUredjuje] = useState<string | null>(
    null
  );
  const [formaIzmene, setFormaIzmene] = useState<NovoJeloForma>(PRAZNA_FORMA);

  const kategorije = useMemo(() => {
    const skup = new Set(jela.map((j) => j.kategorija || "Ostalo"));
    return Array.from(skup).sort();
  }, [jela]);

  async function dodajJelo(e: React.FormEvent) {
    e.preventDefault();
    setGreska("");

    if (!forma.naziv.trim() || !forma.kategorija.trim() || !forma.cena) {
      setGreska("Naziv, kategorija i cena su obavezni.");
      return;
    }

    setSlanje(true);
    try {
      const odgovor = await fetch("/api/jela", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv: forma.naziv.trim(),
          opis: forma.opis.trim(),
          cena: Number(forma.cena),
          kategorija: forma.kategorija.trim(),
          slika: forma.slika.trim(),
          aktivno: true,
        }),
      });

      if (!odgovor.ok) {
        const podaci = await odgovor.json();
        setGreska(podaci.greska || "Nije moguće dodati jelo.");
        return;
      }

      const novo = await odgovor.json();
      setJela((prethodno) => [novo, ...prethodno]);
      setForma(PRAZNA_FORMA);
    } catch {
      setGreska("Greška u komunikaciji sa serverom.");
    } finally {
      setSlanje(false);
    }
  }

  function pocniIzmenu(jelo: Jelo) {
    setIdKojiSeUredjuje(jelo.id);
    setFormaIzmene({
      naziv: jelo.naziv,
      opis: jelo.opis,
      cena: String(jelo.cena),
      kategorija: jelo.kategorija,
      slika: jelo.slika,
    });
    setGreska("");
  }

  function otkaziIzmenu() {
    setIdKojiSeUredjuje(null);
    setFormaIzmene(PRAZNA_FORMA);
  }

  async function sacuvajIzmenu(id: string) {
    setGreska("");

    if (
      !formaIzmene.naziv.trim() ||
      !formaIzmene.kategorija.trim() ||
      !formaIzmene.cena
    ) {
      setGreska("Naziv, kategorija i cena su obavezni.");
      return;
    }

    const odgovor = await fetch(`/api/jela/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naziv: formaIzmene.naziv.trim(),
        opis: formaIzmene.opis.trim(),
        cena: Number(formaIzmene.cena),
        kategorija: formaIzmene.kategorija.trim(),
        slika: formaIzmene.slika.trim(),
      }),
    });

    if (!odgovor.ok) {
      setGreska("Nije moguće sačuvati izmene.");
      return;
    }

    const azurirano = await odgovor.json();
    setJela((prethodno) =>
      prethodno.map((j) => (j.id === id ? azurirano : j))
    );
    otkaziIzmenu();
  }

  async function promeniAktivnost(jelo: Jelo) {
    setGreska("");
    const odgovor = await fetch(`/api/jela/${jelo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aktivno: !jelo.aktivno }),
    });

    if (!odgovor.ok) {
      setGreska("Nije moguće promeniti status jela.");
      return;
    }

    const azurirano = await odgovor.json();
    setJela((prethodno) =>
      prethodno.map((j) => (j.id === jelo.id ? azurirano : j))
    );
  }

  async function obrisi(id: string) {
    if (!confirm("Da li ste sigurni da želite da obrišete ovo jelo?")) return;
    setGreska("");

    const odgovor = await fetch(`/api/jela/${id}`, { method: "DELETE" });
    if (!odgovor.ok) {
      setGreska("Nije moguće obrisati jelo.");
      return;
    }

    setJela((prethodno) => prethodno.filter((j) => j.id !== id));
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={dodajJelo}
        className="space-y-4 rounded-2xl border border-ember-900/40 bg-charcoal-800 p-6"
      >
        <h2 className="font-serif text-xl text-ember-50">Dodaj novo jelo</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-ember-100/70">
              Naziv *
            </label>
            <input
              value={forma.naziv}
              onChange={(e) =>
                setForma({ ...forma, naziv: e.target.value })
              }
              className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
              placeholder="Npr. Ćevapi od dva mesa"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ember-100/70">
              Kategorija *
            </label>
            <input
              value={forma.kategorija}
              onChange={(e) =>
                setForma({ ...forma, kategorija: e.target.value })
              }
              list="postojece-kategorije"
              className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
              placeholder="Npr. Glavna jela"
            />
            <datalist id="postojece-kategorije">
              {kategorije.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-ember-100/70">Opis</label>
          <textarea
            value={forma.opis}
            onChange={(e) => setForma({ ...forma, opis: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
            placeholder="Kratak opis jela"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-ember-100/70">
              Cena (RSD) *
            </label>
            <input
              type="number"
              min={0}
              value={forma.cena}
              onChange={(e) => setForma({ ...forma, cena: e.target.value })}
              className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
              placeholder="780"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ember-100/70">
              URL slike (opciono)
            </label>
            <input
              value={forma.slika}
              onChange={(e) => setForma({ ...forma, slika: e.target.value })}
              className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
              placeholder="https://..."
            />
          </div>
        </div>

        {greska && <p className="text-sm text-red-400">{greska}</p>}

        <button
          type="submit"
          disabled={slanje}
          className="rounded-full bg-ember-500 px-6 py-2 text-sm font-medium text-charcoal-900 hover:bg-ember-400 transition disabled:opacity-60"
        >
          {slanje ? "Dodavanje..." : "Dodaj jelo"}
        </button>
      </form>

      <div>
        <h2 className="mb-4 font-serif text-xl text-ember-50">
          Sva jela ({jela.length})
        </h2>

        {jela.length === 0 ? (
          <p className="rounded-xl border border-ember-900/40 bg-charcoal-800 p-8 text-center text-ember-100/50">
            Još uvek nema dodatih jela.
          </p>
        ) : (
          <div className="space-y-3">
            {jela.map((jelo) => (
              <div
                key={jelo.id}
                className="rounded-xl border border-ember-900/40 bg-charcoal-800 p-5"
              >
                {idKojiSeUredjuje === jelo.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={formaIzmene.naziv}
                        onChange={(e) =>
                          setFormaIzmene({
                            ...formaIzmene,
                            naziv: e.target.value,
                          })
                        }
                        className="rounded-lg border border-ember-900/40 bg-charcoal-900 px-3 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
                        placeholder="Naziv"
                      />
                      <input
                        value={formaIzmene.kategorija}
                        onChange={(e) =>
                          setFormaIzmene({
                            ...formaIzmene,
                            kategorija: e.target.value,
                          })
                        }
                        className="rounded-lg border border-ember-900/40 bg-charcoal-900 px-3 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
                        placeholder="Kategorija"
                      />
                    </div>
                    <textarea
                      value={formaIzmene.opis}
                      onChange={(e) =>
                        setFormaIzmene({
                          ...formaIzmene,
                          opis: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-3 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
                      placeholder="Opis"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="number"
                        min={0}
                        value={formaIzmene.cena}
                        onChange={(e) =>
                          setFormaIzmene({
                            ...formaIzmene,
                            cena: e.target.value,
                          })
                        }
                        className="rounded-lg border border-ember-900/40 bg-charcoal-900 px-3 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
                        placeholder="Cena"
                      />
                      <input
                        value={formaIzmene.slika}
                        onChange={(e) =>
                          setFormaIzmene({
                            ...formaIzmene,
                            slika: e.target.value,
                          })
                        }
                        className="rounded-lg border border-ember-900/40 bg-charcoal-900 px-3 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
                        placeholder="URL slike"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => sacuvajIzmenu(jelo.id)}
                        className="rounded-lg border border-green-500/40 px-3 py-1.5 text-xs text-green-400 hover:bg-green-500/10"
                      >
                        Sačuvaj
                      </button>
                      <button
                        onClick={otkaziIzmenu}
                        className="rounded-lg border border-ember-900/40 px-3 py-1.5 text-xs text-ember-100/60 hover:border-ember-400"
                      >
                        Otkaži
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {jelo.slika && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={jelo.slika}
                          alt={jelo.naziv}
                          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-ember-50">{jelo.naziv}</p>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              jelo.aktivno
                                ? "bg-green-500/15 text-green-400"
                                : "bg-ember-900/40 text-ember-100/50"
                            }`}
                          >
                            {jelo.aktivno ? "Aktivno" : "Neaktivno"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-wide text-ember-300">
                          {jelo.kategorija}
                        </p>
                        {jelo.opis && (
                          <p className="mt-1 max-w-md text-sm text-ember-100/60">
                            {jelo.opis}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-ember-100/70">
                          {jelo.cena} RSD
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => pocniIzmenu(jelo)}
                        className="rounded-lg border border-ember-900/40 px-3 py-1.5 text-xs text-ember-100/70 hover:border-ember-400"
                      >
                        Izmeni
                      </button>
                      <button
                        onClick={() => promeniAktivnost(jelo)}
                        className="rounded-lg border border-ember-500/40 px-3 py-1.5 text-xs text-ember-300 hover:bg-ember-500/10"
                      >
                        {jelo.aktivno ? "Deaktiviraj" : "Aktiviraj"}
                      </button>
                      <button
                        onClick={() => obrisi(jelo.id)}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
