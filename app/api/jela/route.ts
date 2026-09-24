import { NextRequest, NextResponse } from "next/server";
import { dodajJelo, ucitajSvaJela } from "@/lib/db";

export async function GET() {
  const sva = ucitajSvaJela();
  return NextResponse.json(sva);
}

export async function POST(request: NextRequest) {
  const telo = await request.json();
  const { naziv, opis, cena, kategorija, slika, aktivno } = telo;

  if (!naziv || !kategorija || cena === undefined || cena === null) {
    return NextResponse.json(
      { greska: "Naziv, kategorija i cena su obavezni." },
      { status: 400 }
    );
  }

  const brojCena = Number(cena);
  if (Number.isNaN(brojCena) || brojCena < 0) {
    return NextResponse.json(
      { greska: "Cena mora biti pozitivan broj." },
      { status: 400 }
    );
  }

  const novo = dodajJelo({
    naziv: String(naziv).trim(),
    opis: String(opis || "").trim(),
    cena: brojCena,
    kategorija: String(kategorija).trim(),
    slika: String(slika || "").trim(),
    aktivno: aktivno === undefined ? true : Boolean(aktivno),
  });

  return NextResponse.json(novo, { status: 201 });
}
