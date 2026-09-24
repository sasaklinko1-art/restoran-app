import { NextRequest, NextResponse } from "next/server";
import { izmeniJelo, obrisiJelo } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const telo = await request.json();

  const izmene: Record<string, unknown> = {};

  if (telo.naziv !== undefined) izmene.naziv = String(telo.naziv).trim();
  if (telo.opis !== undefined) izmene.opis = String(telo.opis).trim();
  if (telo.kategorija !== undefined)
    izmene.kategorija = String(telo.kategorija).trim();
  if (telo.slika !== undefined) izmene.slika = String(telo.slika).trim();
  if (telo.aktivno !== undefined) izmene.aktivno = Boolean(telo.aktivno);

  if (telo.cena !== undefined) {
    const brojCena = Number(telo.cena);
    if (Number.isNaN(brojCena) || brojCena < 0) {
      return NextResponse.json(
        { greska: "Cena mora biti pozitivan broj." },
        { status: 400 }
      );
    }
    izmene.cena = brojCena;
  }

  const azurirano = izmeniJelo(id, izmene);
  if (!azurirano) {
    return NextResponse.json(
      { greska: "Jelo nije pronađeno." },
      { status: 404 }
    );
  }
  return NextResponse.json(azurirano);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const uspesno = obrisiJelo(id);
  if (!uspesno) {
    return NextResponse.json(
      { greska: "Jelo nije pronađeno." },
      { status: 404 }
    );
  }
  return NextResponse.json({ uspesno: true });
}
