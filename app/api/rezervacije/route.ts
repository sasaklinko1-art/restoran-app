import { NextRequest, NextResponse } from "next/server";
import { dodajRezervaciju, ucitajSve } from "@/lib/db";

export async function GET() {
  return NextResponse.json(ucitajSve());
}

export async function POST(request: NextRequest) {
  try {
    const telo = await request.json();

    const {
      ime,
      telefon,
      email,
      datum,
      vreme,
      brojGostiju,
      napomena,
      trajanjeMinuta,
      sto,
    } = telo;

    if (!ime || !telefon || !datum || !vreme || !brojGostiju) {
      return NextResponse.json(
        { greska: "Molimo popunite sva obavezna polja." },
        { status: 400 }
      );
    }

    const nova = dodajRezervaciju({
      ime: String(ime).trim(),
      telefon: String(telefon).trim(),
      email: String(email || "").trim(),
      datum: String(datum),
      vreme: String(vreme),
      brojGostiju: Number(brojGostiju),
      napomena: String(napomena || "").trim(),
      trajanjeMinuta: Number(trajanjeMinuta || 120),
      sto: sto ? Number(sto) : undefined,
    });

    return NextResponse.json(nova, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        greska:
          error instanceof Error
            ? error.message
            : "Greška pri kreiranju rezervacije.",
      },
      { status: 400 }
    );
  }
}