import { ucitajSve } from "@/lib/db";
import ReservationsTable from "@/components/ReservationsTable";

export const dynamic = "force-dynamic";

export default async function AdminStranica() {
  const rezervacije = await ucitajSve();

  const naCekanju = rezervacije.filter(
    (r) => r.status === "na_cekanju"
  ).length;

  const potvrdjene = rezervacije.filter(
    (r) => r.status === "potvrdjena"
  ).length;

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-ember-50">
        Rezervacije
      </h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-ember-900/40 bg-charcoal-900 p-5">
          <p className="text-sm text-ember-100/60">
            Ukupno rezervacija
          </p>
          <p className="mt-2 text-3xl font-semibold text-ember-50">
            {rezervacije.length}
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
          <p className="text-sm text-amber-200/70">
            Na čekanju
          </p>
          <p className="mt-2 text-3xl font-semibold text-amber-200">
            {naCekanju}
          </p>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
          <p className="text-sm text-green-300/70">
            Potvrđene
          </p>
          <p className="mt-2 text-3xl font-semibold text-green-300">
            {potvrdjene}
          </p>
        </div>
      </div>

      <ReservationsTable pocetneRezervacije={rezervacije} />
    </div>
  );
}