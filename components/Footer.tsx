export default function Footer() {
  return (
    <footer className="border-t border-ember-900/40 bg-charcoal-900 py-10 text-sm text-ember-100/60">
      <div className="mx-auto max-w-6xl px-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Restoran &bdquo;Kod Stare Lipe&ldquo;</p>
        <p>Kneza Miloša 12, Beograd · +381 60 123 4567</p>
        <p>Radno vreme: 12:00 – 23:00, svaki dan</p>
      </div>
    </footer>
  );
}
