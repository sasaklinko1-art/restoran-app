import { restoran } from "@/lib/restoran";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: restoran.seo.title,
  description: restoran.seo.description,
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