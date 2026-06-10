import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobile World — Celulares y Accesorios | Mayorista y Minorista",
  description:
    "Venta mayorista y minorista de celulares nuevos, usados seleccionados y accesorios tecnológicos. Stock permanente, atención personalizada y los mejores precios.",
  keywords: "celulares, smartphones, accesorios, mayorista, minorista, Nokia, Samsung, Mobi, CAT",
  openGraph: {
    title: "Mobile World — Celulares al mejor precio",
    description:
      "Equipos nuevos, usados seleccionados y accesorios con stock permanente y los mejores precios.",
    siteName: "Mobile World",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-[#0A0F1E] text-[#E2E8F0]">
        {children}
      </body>
    </html>
  );
}
