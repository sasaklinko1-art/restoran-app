import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kod Stare Lipe — Restoran i rezervacije",
  description:
    "Tradicionalna domaća kuhinja u srcu grada. Rezervišite sto online za nezaboravno veče.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
