"use client";

import { useMemo, useState } from "react";

const terminiVremena = Array.from({ length: 48 }, (_, i) => {
  const sati = String(Math.floor(i / 2)).padStart(2, "0");
  const minuti = i % 2 === 0 ? "00" : "30";
  return `${sati}:${minuti}`;
});

export default function FormaRezervacije() {
  const danas = useMemo(() => {
    const datum = new Date();
    const godina = datum.getFullYear();
    const mesec = String(datum.getMonth() + 1).padStart(2, "0");
    const dan = String(datum.getDate()).padStart(2, "0");
    return `${godina}-${mesec}-${dan}`;
  }, []);

  const [ime, setIme] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [datum, setDatum] = useState("");
  const [vreme, setVreme] = useState("");
  const [brojGostiju, setBrojGostiju] = useState("2");
  const [napomena, setNapomena] = useState("");
  const [trajanjeMinuta, setTrajanjeMinuta] = useState("120");
  const [uspesno, setUspesno] = useState("");
  const [greska, setGreska] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGreska("");
    setUspesno("");
    setLoading(true);

    try {
      const odgovor = await fetch("/api/rezervacije", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ime,
          telefon,
          email,
          datum,
          vreme,
          brojGostiju: Number(brojGostiju),
          napomena,
          trajanjeMinuta: Number(trajanjeMinuta),
        }),
      });

      const podaci = await odgovor.json();

      if (!odgovor.ok) {
        setGreska(podaci?.greska || "Došlo je do greške.");
        return;
      }

      setUspesno(
        "Hvala vam na rezervaciji! Vaš zahtev je primljen. Potvrdićemo rezervaciju telefonom u najkraćem roku."
      );

      setIme("");
      setTelefon("");
      setEmail("");
      setDatum("");
      setVreme("");
      setBrojGostiju("2");
      setNapomena("");
      setTrajanjeMinuta("120");
    } catch {
      setGreska("Došlo je do greške prilikom slanja rezervacije.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-ember-900/40 bg-charcoal-900 p-6 shadow-lg"
    >
      <h2 className="mb-6 font-serif text-3xl text-ember-50">
        Rezerviši sto
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="ime"
            className="block text-sm font-medium text-ember-100"
          >
            Ime i prezime
          </label>

          <input
            id="ime"
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Unesite ime i prezime"
            required
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="telefon"
            className="block text-sm font-medium text-ember-100"
          >
            Telefon
          </label>

          <input
            id="telefon"
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            placeholder="0601234567"
            required
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-ember-100"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ime@email.com"
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="brojGostiju"
            className="block text-sm font-medium text-ember-100"
          >
            Broj gostiju
          </label>

          <select
            id="brojGostiju"
            value={brojGostiju}
            onChange={(e) => setBrojGostiju(e.target.value)}
            required
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((broj) => (
              <option key={broj} value={broj}>
                {broj}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="datum"
            className="block text-sm font-medium text-ember-100"
          >
            Datum
          </label>

          <input
            id="datum"
            type="date"
            min={danas}
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            required
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="vreme"
            className="block text-sm font-medium text-ember-100"
          >
            Vreme
          </label>

          <select
            id="vreme"
            value={vreme}
            onChange={(e) => setVreme(e.target.value)}
            required
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
          >
            <option value="">Izaberi vreme</option>
            {terminiVremena.map((termin) => (
              <option key={termin} value={termin}>
                {termin}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="trajanjeMinuta"
            className="block text-sm font-medium text-ember-100"
          >
            Trajanje rezervacije
          </label>

          <select
            id="trajanjeMinuta"
            value={trajanjeMinuta}
            onChange={(e) => setTrajanjeMinuta(e.target.value)}
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
            required
          >
            <option value="60">1 sat</option>
            <option value="90">1 sat 30 min</option>
            <option value="120">2 sata</option>
            <option value="150">2 sata 30 min</option>
            <option value="180">3 sata</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label
          htmlFor="napomena"
          className="block text-sm font-medium text-ember-100"
        >
          Napomena
        </label>

        <textarea
          id="napomena"
          value={napomena}
          onChange={(e) => setNapomena(e.target.value)}
          placeholder="Alergije, rođendan, posebni zahtevi..."
          className="min-h-28 w-full rounded-lg border border-ember-900/40 bg-charcoal-800 px-4 py-3 text-ember-50 outline-none focus:border-ember-400"
        />
      </div>

      {greska && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {greska}
        </p>
      )}

      {uspesno && (
        <p className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {uspesno}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-lg bg-ember-500 px-5 py-3 font-medium text-charcoal-950 transition hover:bg-ember-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Slanje..." : "Pošalji rezervaciju"}
      </button>
    </form>
  );
}