import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormaRezervacije from "@/components/FormaRezervacije";

export default function RezervacijaStranica() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="mb-2 font-serif text-4xl text-ember-50">
          Rezervišite sto
        </h1>

        <p className="mb-10 text-ember-100/60">
          Popunite formular ispod i naš tim će potvrditi vašu rezervaciju
          telefonskim putem.
        </p>

        <FormaRezervacije />
      </main>

      <Footer />
    </>
  );
}