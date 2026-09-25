export const restoran = {
  naziv: "Kod Stare Lipe",
  kratkiNaziv: "Stara Lipa",
  slogan: "Domaća kuhinja, topla atmosfera i ukus koji se pamti.",
  opis:
    "Tradicionalni restoran sa domaćom kuhinjom, svežim sastojcima i toplim ambijentom za porodične ručkove, proslave i rezervacije.",
  adresa: "Ulica i broj, Grad",
  grad: "Beograd",
  godinaOsnivanja: 1994,
  brojMesta: 80,
  ocena: "4.8/5",
  telefon: "+381 60 123 4567",
  email: "kontakt@kodstarelipe.rs",
  instagram: "https://instagram.com/kodstarelipe",
  facebook: "",
  mapaUrl: "",
  radnoVreme: {
    ponedeljakPetak: "12:00 - 23:00",
    subotaNedelja: "12:00 - 00:00",
  },
  rezervacije: {
    brojStolova: 30,
    trajanjeMinuta: 120,
    maksimalnoGostijuPoRezervaciji: 12,
  },
  seo: {
    title: "Kod Stare Lipe",
    description:
      "Restoran sa domaćom kuhinjom, rezervacijama i jelovnikom online.",
    keywords: [
      "restoran",
      "domaća kuhinja",
      "rezervacija stola",
      "jelovnik",
      "Beograd",
    ],
  },
  hero: {
    naslov: "Dobrodošli u Kod Stare Lipe",
    podnaslov: "Ukus doma u prijatnom ambijentu.",
  },
  izdvojenaJela: [
    {
      naziv: "Teleća čorba",
      opis: "Polako kuvana, sa domaćim rezancima i svežim začinskim biljem.",
      cena: "480 RSD",
    },
    {
      naziv: "Ćevapi od dva mesa",
      opis: "Deset komada, luk, kajmak i topao lepinja hleb.",
      cena: "780 RSD",
    },
    {
      naziv: "Punjene paprike",
      opis: "Sa mlevenim mesom i pirinčem, u domaćem paradajz sosu.",
      cena: "690 RSD",
    },
  ],
  kontakt: {
    telefonLabel: "Telefon",
    emailLabel: "Email",
    adresaLabel: "Adresa",
    radnoVremeLabel: "Radno vreme",
  },
} as const;