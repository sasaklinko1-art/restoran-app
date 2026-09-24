import Link from "next/link";
import OdjaviDugme from "./OdjaviDugme";

export default function ZasticeniAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-900">
      <header className="border-b border-ember-900/40 bg-charcoal-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="font-serif text-lg text-ember-100">
            Admin panel · Kod Stare Lipe
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/admin"
              className="rounded-full border border-ember-900/40 px-4 py-1.5 text-ember-100/70 hover:border-ember-400"
            >
              Rezervacije
            </Link>
            <Link
              href="/admin/meni"
              className="rounded-full border border-ember-900/40 px-4 py-1.5 text-ember-100/70 hover:border-ember-400"
            >
              Meni
            </Link>
          </nav>
          <OdjaviDugme />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
