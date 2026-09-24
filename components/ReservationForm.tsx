"use client";

import { useState } from "react";

type Stanje = "forma" | "slanje" | "uspesno" | "greska";

export default function FormularRezervacije() {
  const [stanje, setStanje] = useState<Stanje>("forma");
  const [porukaGreske, setPorukaGreske] = useState("");

  async function posaljiFormular(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStanje("slanje");
    setPorukaGreske("");

    const formData = new FormData(e.currentTarget);
    const telo = {
      ime: formData.get("ime"),
      telefon: formData.get("telefon"),
      email: formData.get("email"),
      datum: formData.get("datum"),
      vreme: formData.get("vreme"),
      brojGostiju: formData.get("brojGostiju"),
      napomena: formData.get("napomena"),
    };

    try {
      const odgovor = await fetch("/api/rezervacije", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telo),
      });

      if (!odgovor.ok) {
        const podaci = await odgovor.json();
        setPorukaGreske(podaci.greska || "Došlo je do greške.");
        setStanje("greska");
        return;
      }

      setStanje("uspesno");
      (e.target as HTMLFormElement).reset();
    } catch {
      setPorukaGreske("Nije moguće poslati zahtev. Proverite konekciju.");
      setStanje("greska");
    }
  }

  if (stanje === "uspesno") {
    return (
      <div className="rounded-2xl border border-ember-500/40 bg-ember-500/10 p-8 text-center">
        <h2 className="font-serif text-2xl text-ember-100">
          Hvala vam na rezervaciji!
        </h2>
        <p className="mt-2 text-ember-100/70">
          Vaš zahtev je primljen. Potvrdićemo rezervaciju telefonom u
          najkraćem roku.
        </p>
        <button
          onClick={() => setStanje("forma")}
          className="mt-6 rounded-full border border-ember-300/40 px-6 py-2 text-sm text-ember-100 hover:border-ember-300 transition"
        >
          Napravite novu rezervaciju
        </button>
      </div>
    );
  }

  const danas = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={posaljiFormular}
      className="space-y-5 rounded-2xl border border-ember-900/40 bg-charcoal-800 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-ember-100/70">
            Ime i prezime *
          </label>
          <input
            name="ime"
            required
            maxLength={80}
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
            placeholder="Marko Marković"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ember-100/70">
            Broj telefona *
          </label>
          <input
            name="telefon"
            required
            maxLength={30}
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
            placeholder="+381 6X XXX XXXX"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ember-100/70">
          Email (opciono)
        </label>
        <input
          name="email"
          type="email"
          maxLength={100}
          className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
          placeholder="vas.email@primer.com"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm text-ember-100/70">
            Datum *
          </label>
          <input
            name="datum"
            type="date"
            required
            min={danas}
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ember-100/70">
            Vreme *
          </label>
          <input
            name="vreme"
            type="time"
            required
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ember-100/70">
            Broj gostiju *
          </label>
          <input
            name="brojGostiju"
            type="number"
            min={1}
            max={30}
            required
            defaultValue={2}
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ember-100/70">
          Napomena (opciono)
        </label>
        <textarea
          name="napomena"
          rows={3}
          maxLength={300}
          className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
          placeholder="Alergije, proslava, poseban zahtev..."
        />
      </div>

      {stanje === "greska" && (
        <p className="text-sm text-red-400">{porukaGreske}</p>
      )}

      <button
        type="submit"
        disabled={stanje === "slanje"}
        className="w-full rounded-full bg-ember-500 px-6 py-3 font-medium text-charcoal-900 hover:bg-ember-400 transition disabled:opacity-60"
      >
        {stanje === "slanje" ? "Slanje..." : "Potvrdite rezervaciju"}
      </button>
    </form>
  );
}
