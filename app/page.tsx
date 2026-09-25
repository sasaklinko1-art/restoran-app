import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { restoran } from "@/lib/restoran";

export default function PocetnaStranica() {
  return (
    <>
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal-800 to-charcoal-900 px-5 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-ember-300">
              Od {restoran.godinaOsnivanja}. godine
            </p>

            <h1 className="font-serif text-4xl leading-tight text-ember-50 sm:text-6xl">
              {restoran.hero.naslov}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-ember-100/70">
              {restoran.opis}
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base text-ember-100/60">
              {restoran.hero.podnaslov}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/rezervacija"
                className="rounded-full bg-ember-500 px-8 py-3 font-medium text-charcoal-900 transition hover:bg-ember-400"
              >
                Rezervišite sto
              </Link>

              <Link
                href="/meni"
                className="rounded-full border border-ember-300/40 px-8 py-3 font-medium text-ember-100 transition hover:border-ember-300"
              >
                Pogledajte meni
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="mb-2 font-serif text-3xl text-ember-50">
            Izdvajamo iz menija
          </h2>

          <p className="mb-10 text-ember-100/60">
            Nekoliko jela po kojima nas gosti najviše pamte.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {restoran.izdvojenaJela.map((jelo) => (
              <div
                key={jelo.naziv}
                className="rounded-2xl border border-ember-900/40 bg-charcoal-800 p-6"
              >
                <h3 className="font-serif text-xl text-ember-100">
                  {jelo.naziv}
                </h3>

                <p className="mt-2 text-sm text-ember-100/60">
                  {jelo.opis}
                </p>

                <p className="mt-4 font-medium text-ember-300">
                  {jelo.cena}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-ember-900/40 bg-charcoal-800 px-5 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
            <div className="text-center">
              <p className="font-serif text-3xl text-ember-300">
                {restoran.godinaOsnivanja}
              </p>
              <p className="mt-2 text-sm text-ember-100/60">
                godina osnivanja
              </p>
            </div>

            <div className="text-center">
              <p className="font-serif text-3xl text-ember-300">
                {restoran.brojMesta}
              </p>
              <p className="mt-2 text-sm text-ember-100/60">
                mesta u bašti i sali
              </p>
            </div>

            <div className="text-center">
              <p className="font-serif text-3xl text-ember-300">
                {restoran.ocena}
              </p>
              <p className="mt-2 text-sm text-ember-100/60">
                prosečna ocena gostiju
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}