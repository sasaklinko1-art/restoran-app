import { ucitajSve } from "@/lib/db";
import TabelaRezervacija from "@/components/ReservationsTable";

export const dynamic = "force-dynamic";

export default function AdminPocetna() {
  const rezervacije = ucitajSve();

  const naCekanju = rezervacije.filter((r) => r.status === "na_cekanju").length;
  const potvrdjene = rezervacije.filter((r) => r.status === "potvrdjena").length;

  return (
  <div>
    <h1 className="mb-2 font-serif text-3xl text-ember-50">
      Rezervacije
    </h1>

    <p className="mb-8 text-ember-100/60">
      Pregled svih rezervacija
    </p>

    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-yellow-500/30 bg-charcoal-800 p-5">
        <p className="text-sm text-ember-100/60">Na čekanju</p>
        <p className="mt-2 text-3xl font-bold text-yellow-400">
          {naCekanju}
        </p>
      </div>

      <div className="rounded-xl border border-green-500/30 bg-charcoal-800 p-5">
        <p className="text-sm text-ember-100/60">Potvrđene</p>
        <p className="mt-2 text-3xl font-bold text-green-400">
          {potvrdjene}
        </p>
      </div>

      <div className="rounded-xl border border-ember-500/30 bg-charcoal-800 p-5">
        <p className="text-sm text-ember-100/60">Ukupno</p>
        <p className="mt-2 text-3xl font-bold text-ember-50">
          {rezervacije.length}
        </p>
      </div>
    </div>

    <TabelaRezervacija pocetneRezervacije={rezervacije} />
  </div>
);
}
