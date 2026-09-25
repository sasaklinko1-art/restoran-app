import { restoran } from "@/lib/restoran";

export default function Footer() {
  return (
    <footer className="border-t border-ember-900/40 bg-charcoal-900 py-10 text-sm text-ember-100/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {restoran.naziv}
        </p>
        <p>
          {restoran.adresa} · {restoran.telefon}
        </p>
        <p>Radno vreme: {restoran.radnoVreme.ponedeljakPetak}</p>
      </div>
    </footer>
  );
}