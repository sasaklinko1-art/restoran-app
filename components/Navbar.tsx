import Link from "next/link";
import { restoran } from "@/lib/restoran";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ember-900/40 bg-charcoal-900/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-serif text-xl tracking-wide text-ember-100"
        >
          {restoran.naziv}
        </Link>

        <div className="flex items-center gap-6 text-sm text-ember-100/80">
          <Link href="/" className="transition hover:text-ember-300">
            Početna
          </Link>
          <Link href="/meni" className="transition hover:text-ember-300">
            Meni
          </Link>
          <Link
            href="/rezervacija"
            className="rounded-full bg-ember-500 px-4 py-2 font-medium text-charcoal-900 transition hover:bg-ember-400"
          >
            Rezervišite sto
          </Link>
        </div>
      </nav>
    </header>
  );
}
