"use client";

import { useEffect, useMemo, useState } from "react";
import type { Rezervacija, StatusRezervacije } from "@/lib/db";

const OZNAKE_STATUSA: Record<StatusRezervacije, string> = {
  na_cekanju: "Na čekanju",
  potvrdjena: "Potvrđena",
  otkazana: "Otkazana",
};

const BOJE_STATUSA: Record<StatusRezervacije, string> = {
  na_cekanju: "bg-yellow-500/15 text-yellow-400",
  potvrdjena: "bg-green-500/15 text-green-400",
  otkazana: "bg-red-500/15 text-red-400",
};

export default function TabelaRezervacija({
  pocetneRezervacije,
}: {
  pocetneRezervacije: Rezervacija[];
}) {
  const [rezervacije, setRezervacije] = useState(pocetneRezervacije);
  const [filter, setFilter] = useState<StatusRezervacije | "sve">("sve");
  const [greska, setGreska] = useState("");
  const [pretraga, setPretraga] = useState("");

  const [sortiranje, setSortiranje] = useState<{
    polje: "ime" | "datum" | "kreirano" | "status";
    smer: "asc" | "desc";
  }>({
    polje: "datum",
    smer: "asc",
  });

  async function osveziListu() {
    try {
      const odgovor = await fetch("/api/rezervacije");

      if (odgovor.ok) {
        setRezervacije(await odgovor.json());
      }
    } catch {
      // lista ostaje ista
    }
  }

  useEffect(() => {
    const interval = setInterval(osveziListu, 30000);
    return () => clearInterval(interval);
  }, []);

  function strelica(polje: "ime" | "datum" | "kreirano" | "status") {
    if (sortiranje.polje !== polje) return "";
    return sortiranje.smer === "asc" ? " ↑" : " ↓";
  }

  async function promeniStatus(id: string, status: StatusRezervacije) {
    setGreska("");

    const odgovor = await fetch(`/api/rezervacije/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!odgovor.ok) {
      setGreska("Nije moguće ažurirati status.");
      return;
    }

    const azurirana = await odgovor.json();

    setRezervacije((prethodno) =>
      prethodno.map((r) => (r.id === id ? azurirana : r))
    );
  }

  async function promeniSto(id: string, sto: number) {
    setGreska("");

    const odgovor = await fetch(`/api/rezervacije/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sto }),
    });

    if (!odgovor.ok) {
      setGreska("Nije moguće dodeliti taj sto.");
      return;
    }

    const azurirana = await odgovor.json();

    setRezervacije((prethodno) =>
      prethodno.map((r) => (r.id === id ? azurirana : r))
    );
  }

  async function obrisiRezervaciju(id: string) {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu rezervaciju?")) {
      return;
    }

    setGreska("");

    const odgovor = await fetch(`/api/rezervacije/${id}`, {
      method: "DELETE",
    });

    if (!odgovor.ok) {
      setGreska("Nije moguće obrisati rezervaciju.");
      return;
    }

    setRezervacije((prethodno) => prethodno.filter((r) => r.id !== id));
  }

  const filtrirane = useMemo(() => {
    let lista =
      filter === "sve"
        ? rezervacije
        : rezervacije.filter((r) => r.status === filter);

    if (pretraga.trim()) {
      const tekst = pretraga.toLowerCase();

      lista = lista.filter(
        (r) =>
          r.ime.toLowerCase().includes(tekst) ||
          r.telefon.toLowerCase().includes(tekst)
      );
    }

    return [...lista].sort((a, b) => {
      let rezultat = 0;

      if (sortiranje.polje === "ime") {
        rezultat = a.ime.localeCompare(b.ime);
      }

      if (sortiranje.polje === "datum") {
        rezultat =
          new Date(`${a.datum} ${a.vreme}`).getTime() -
          new Date(`${b.datum} ${b.vreme}`).getTime();
      }

      if (sortiranje.polje === "kreirano") {
        rezultat = a.kreirano.localeCompare(b.kreirano);
      }

      if (sortiranje.polje === "status") {
        rezultat = a.status.localeCompare(b.status);
      }

      return sortiranje.smer === "asc" ? rezultat : -rezultat;
    });
  }, [rezervacije, filter, pretraga, sortiranje]);

  const predlozi = useMemo(() => {
    const tekst = pretraga.trim().toLowerCase();

    if (!tekst) return [];

    return [...new Set(rezervacije.map((r) => r.ime.trim()))].filter((ime) =>
      ime.toLowerCase().includes(tekst)
    );
  }, [rezervacije, pretraga]);

  const zauzetostPoStolu = useMemo(() => {
    const mapa = new Map<number, number>();

    rezervacije.forEach((r) => {
      if (r.sto > 0) {
        mapa.set(r.sto, (mapa.get(r.sto) || 0) + 1);
      }
    });

    return Array.from({ length: 30 }, (_, i) => {
      const sto = i + 1;
      return {
        sto,
        broj: mapa.get(sto) || 0,
      };
    });
  }, [rezervacije]);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-5 xl:grid-cols-6">
        {zauzetostPoStolu.map((stavka) => (
          <div
            key={stavka.sto}
            className={`rounded-xl border p-3 text-sm ${
              stavka.broj > 0
                ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                : "border-green-500/30 bg-green-500/10 text-green-300"
            }`}
          >
            <p className="font-medium">Sto {stavka.sto}</p>
            <p>{stavka.broj > 0 ? `${stavka.broj} rezerv.` : "Slobodan"}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 space-y-3">
        <input
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          placeholder="Pretraži ime ili telefon..."
          className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-sm text-ember-50 outline-none focus:border-ember-400"
        />

        {predlozi.length > 0 && (
          <div className="rounded-xl border border-ember-900/40 bg-charcoal-900 p-2">
            {predlozi.map((ime) => (
              <button
                key={ime}
                type="button"
                onClick={() => setPretraga(ime)}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ember-100/80 hover:bg-ember-500/10 hover:text-ember-50"
              >
                {ime}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {(["sve", "na_cekanju", "potvrdjena", "otkazana"] as const).map(
            (opcija) => (
              <button
                key={opcija}
                onClick={() => setFilter(opcija)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  filter === opcija
                    ? "bg-ember-500 text-charcoal-900"
                    : "border border-ember-900/40 text-ember-100/70 hover:border-ember-400"
                }`}
              >
                {opcija === "sve" ? "Sve" : OZNAKE_STATUSA[opcija]}
              </button>
            )
          )}

          <span className="ml-auto text-sm text-ember-100/50">
            {filtrirane.length} rezervacija
          </span>
        </div>
      </div>

      {greska && (
        <p className="mb-4 text-sm text-red-400">{greska}</p>
      )}

      {filtrirane.length === 0 ? (
        <p className="rounded-xl border border-ember-900/40 bg-charcoal-800 p-8 text-center text-ember-100/50">
          Nema rezervacija za prikaz.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ember-900/40">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-charcoal-800 text-ember-100/60">
              <tr>
                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() =>
                    setSortiranje({
                      polje: "ime",
                      smer: sortiranje.smer === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Gost{strelica("ime")}
                </th>

                <th className="px-4 py-3 font-medium">Kontakt</th>

                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() =>
                    setSortiranje({
                      polje: "datum",
                      smer: sortiranje.smer === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Datum / vreme{strelica("datum")}
                </th>

                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() =>
                    setSortiranje({
                      polje: "kreirano",
                      smer: sortiranje.smer === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Kreirano{strelica("kreirano")}
                </th>

                <th className="px-4 py-3 font-medium">Trajanje</th>

                <th className="px-4 py-3 font-medium">Sto</th>

                <th className="px-4 py-3 font-medium">Gostiju</th>

                <th
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() =>
                    setSortiranje({
                      polje: "status",
                      smer: sortiranje.smer === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Status{strelica("status")}
                </th>

                <th className="px-4 py-3 font-medium">Akcije</th>
              </tr>
            </thead>

            <tbody>
              {filtrirane.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-ember-900/30 bg-charcoal-900 align-top"
                >
                  <td className="px-4 py-3">
                    <p className="text-ember-50">{r.ime}</p>

                    {r.napomena && (
                      <p className="mt-1 max-w-[220px] text-xs text-ember-100/50">
                        {r.napomena}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3 text-ember-100/70">
                    <p>{r.telefon}</p>
                    {r.email && <p className="text-xs">{r.email}</p>}
                  </td>

                  <td className="px-4 py-3 text-ember-100/70">
                    {r.datum} u {r.vreme}
                  </td>

                  <td className="px-4 py-3 text-ember-100/70">
                    {new Date(r.kreirano).toLocaleString("sr-RS", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>

                  <td className="px-4 py-3 text-ember-100/70">
                    {r.trajanjeMinuta} min
                  </td>

                  <td className="px-4 py-3 text-ember-100/70">
                    Sto {r.sto}
                  </td>

                  <td className="px-4 py-3 text-ember-100/70">
                    {r.brojGostiju}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${BOJE_STATUSA[r.status]}`}
                    >
                      {OZNAKE_STATUSA[r.status]}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={r.sto}
                        onChange={(e) =>
                          promeniSto(r.id, Number(e.target.value))
                        }
                        className="rounded-lg border border-ember-900/40 bg-charcoal-800 px-2 py-1 text-xs text-ember-50"
                      >
                        {Array.from({ length: 30 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Sto {i + 1}
                          </option>
                        ))}
                      </select>

                      {r.status !== "potvrdjena" && (
                        <button
                          onClick={() => promeniStatus(r.id, "potvrdjena")}
                          className="rounded-lg border border-green-500/40 px-2 py-1 text-xs text-green-400 hover:bg-green-500/10"
                        >
                          Potvrdi
                        </button>
                      )}

                      {r.status !== "otkazana" && (
                        <button
                          onClick={() => promeniStatus(r.id, "otkazana")}
                          className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Otkaži
                        </button>
                      )}

                      <button
                        onClick={() => obrisiRezervaciju(r.id)}
                        className="rounded-lg border border-ember-900/40 px-2 py-1 text-xs text-ember-100/60 hover:border-ember-400"
                      >
                        Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}