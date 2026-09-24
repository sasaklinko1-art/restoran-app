import { NextRequest, NextResponse } from "next/server";
import { azurirajRezervaciju, obrisiRezervaciju } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const telo = await request.json();

  const izmene: {
    status?: "na_cekanju" | "potvrdjena" | "otkazana";
    sto?: number;
    trajanjeMinuta?: number;
  } = {};

  if (telo.status) {
    if (!["na_cekanju", "potvrdjena", "otkazana"].includes(telo.status)) {
      return NextResponse.json(
        { greska: "Nevažeći status." },
        { status: 400 }
      );
    }

    izmene.status = telo.status;
  }

  if (telo.sto !== undefined) {
    izmene.sto = Number(telo.sto);
    if (!Number.isFinite(izmene.sto) || izmene.sto < 1) {
      return NextResponse.json(
        { greska: "Nevažeći sto." },
        { status: 400 }
      );
    }
  }

  if (telo.trajanjeMinuta !== undefined) {
    izmene.trajanjeMinuta = Number(telo.trajanjeMinuta);
    if (!Number.isFinite(izmene.trajanjeMinuta) || izmene.trajanjeMinuta < 30) {
      return NextResponse.json(
        { greska: "Nevažeće trajanje." },
        { status: 400 }
      );
    }
  }

  const azurirana = azurirajRezervaciju(id, izmene);

  if (!azurirana) {
    return NextResponse.json(
      { greska: "Rezervacija nije pronađena ili je sto zauzet." },
      { status: 404 }
    );
  }

  return NextResponse.json(azurirana);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const uspesno = obrisiRezervaciju(id);

  if (!uspesno) {
    return NextResponse.json(
      { greska: "Rezervacija nije pronađena." },
      { status: 404 }
    );
  }

  return NextResponse.json({ uspesno: true });
}