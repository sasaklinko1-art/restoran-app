import { restoran } from "@/lib/restoran";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(restoran.url),

  title: {
    default: restoran.seo.title,
    template: `%s | ${restoran.naziv}`,
  },

  description: restoran.seo.description,

  keywords: [...restoran.seo.keywords],

  alternates: {
    canonical: restoran.url,
  },

  verification: {
    google: "hTzCaLqEqaTtGRsR0CXwg4Jtog_UWre5JZncdmfxd20",
  },

  openGraph: {
    title: restoran.seo.title,
    description: restoran.seo.description,
    url: restoran.url,
    siteName: restoran.naziv,
    locale: "sr_RS",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
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