import { NextRequest, NextResponse } from "next/server";
import { NAZIV_KOLACICA, napraviTokenSesije, proveriLozinku } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { lozinka } = await request.json();

  if (!lozinka || !proveriLozinku(String(lozinka))) {
    return NextResponse.json({ greska: "Pogrešna lozinka." }, { status: 401 });
  }

  const token = napraviTokenSesije();
  const odgovor = NextResponse.json({ uspesno: true });
  odgovor.cookies.set(NAZIV_KOLACICA, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 sati
  });
  return odgovor;
}

export async function DELETE() {
  const odgovor = NextResponse.json({ uspesno: true });
  odgovor.cookies.set(NAZIV_KOLACICA, "", { path: "/", maxAge: 0 });
  return odgovor;
}
