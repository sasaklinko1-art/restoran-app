"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginStranica() {
  const router = useRouter();
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [ucitavanje, setUcitavanje] = useState(false);

  async function prijaviSe(e: React.FormEvent) {
    e.preventDefault();
    setUcitavanje(true);
    setGreska("");

    try {
      const odgovor = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lozinka }),
      });

      if (!odgovor.ok) {
        const podaci = await odgovor.json();
        setGreska(podaci.greska || "Prijava nije uspela.");
        setUcitavanje(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setGreska("Greška u komunikaciji sa serverom.");
      setUcitavanje(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal-900 px-5">
      <form
        onSubmit={prijaviSe}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-ember-900/40 bg-charcoal-800 p-8"
      >
        <div>
          <h1 className="font-serif text-2xl text-ember-50">Admin panel</h1>
          <p className="mt-1 text-sm text-ember-100/60">
            Prijavite se da biste upravljali rezervacijama.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm text-ember-100/70">
            Lozinka
          </label>
          <input
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg border border-ember-900/40 bg-charcoal-900 px-4 py-2 text-ember-50 outline-none focus:border-ember-400"
          />
        </div>
        {greska && <p className="text-sm text-red-400">{greska}</p>}
        <button
          type="submit"
          disabled={ucitavanje}
          className="w-full rounded-full bg-ember-500 px-6 py-3 font-medium text-charcoal-900 hover:bg-ember-400 transition disabled:opacity-60"
        >
          {ucitavanje ? "Prijavljivanje..." : "Prijavite se"}
        </button>
      </form>
    </main>
  );
}
