import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ucitajSvaJela } from "@/lib/db";
import type { Jelo } from "@/lib/db";

export const dynamic = "force-dynamic";

function grupisiPoKategoriji(jela: Jelo[]): Map<string, Jelo[]> {
  const grupe = new Map<string, Jelo[]>();

  for (const jelo of jela) {
    const kategorija = jelo.kategorija || "Ostalo";
    const postojeca = grupe.get(kategorija) || [];
    postojeca.push(jelo);
    grupe.set(kategorija, postojeca);
  }

  return grupe;
}

export default async function MeniStranica() {
  const svaJela = await ucitajSvaJela();
  const aktivnaJela = svaJela.filter((j) => j.aktivno);
  const grupisano = grupisiPoKategoriji(aktivnaJela);
  const kategorije = Array.from(grupisano.keys()).sort();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-16">
        <h1 className="mb-2 font-serif text-4xl text-ember-50">Naš meni</h1>
        <p className="mb-12 text-ember-100/60">
          Sve u domaćem stilu, sa svežim sastojcima od proverenih dobavljača.
        </p>

        {kategorije.length === 0 ? (
          <p className="rounded-xl border border-ember-900/40 bg-charcoal-800 p-8 text-center text-ember-100/50">
            Meni se trenutno ažurira. Svratite uskoro!
          </p>
        ) : (
          <div className="space-y-12">
            {kategorije.map((kategorija) => (
              <section key={kategorija}>
                <h2 className="mb-4 border-b border-ember-900/40 pb-2 font-serif text-2xl text-ember-300">
                  {kategorija}
                </h2>
                <ul className="space-y-5">
                  {grupisano.get(kategorija)!.map((jelo) => (
                    <li key={jelo.id} className="flex items-start gap-4">
                      {jelo.slika && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={jelo.slika}
                          alt={jelo.naziv}
                          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-ember-100">{jelo.naziv}</span>
                          <span className="flex-1 border-b border-dotted border-ember-900/40" />
                          <span className="whitespace-nowrap text-ember-100/70">
                            {jelo.cena} RSD
                          </span>
                        </div>
                        {jelo.opis && (
                          <p className="mt-1 text-sm text-ember-100/50">
                            {jelo.opis}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
