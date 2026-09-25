import { ucitajSvaJela } from "@/lib/db";
import MeniAdminUpravljanje from "@/components/MenuAdminManager";

export const dynamic = "force-dynamic";

export default async function AdminMeniStranica() {
  const jela = await ucitajSvaJela();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-ember-50">
        Upravljanje jelovnikom
      </h1>

      <p className="mb-8 text-ember-100/60">
        Dodajte, izmenite ili uklonite jela. Neaktivna jela se ne prikazuju
        na javnoj stranici menija.
      </p>

      <MeniAdminUpravljanje pocetnaJela={jela} />
    </div>
  );
}