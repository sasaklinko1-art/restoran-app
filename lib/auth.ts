import crypto from "crypto";

const COOKIE_NAME = "admin_sesija";

function tajna(): string {
  return process.env.SESSION_SECRET || "razvojna-tajna-vrednost";
}

export function napraviTokenSesije(): string {
  const payload = `admin:${Date.now()}`;
  const potpis = crypto
    .createHmac("sha256", tajna())
    .update(payload)
    .digest("hex");


  return Buffer.from(`${payload}:${potpis}`).toString("base64url");
}

export function proveriTokenSesije(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const dekodirano = Buffer.from(token, "base64url").toString("utf-8");
    const delovi = dekodirano.split(":");

    if (delovi.length !== 3) return false;

    const [oznaka, vremenskaOznaka, potpis] = delovi;

    if (oznaka !== "admin") return false;

    const payload = `${oznaka}:${vremenskaOznaka}`;

    const ocekivaniPotpis = crypto
      .createHmac("sha256", tajna())
      .update(payload)
      .digest("hex");


    return potpis.trim() === ocekivaniPotpis.trim();

  } catch {
    return false;
  }
}
export function proveriLozinku(lozinka: string): boolean {
  const ispravna = process.env.ADMIN_PASSWORD || "admin123";
  return lozinka === ispravna;
}

export const NAZIV_KOLACICA = COOKIE_NAME;
