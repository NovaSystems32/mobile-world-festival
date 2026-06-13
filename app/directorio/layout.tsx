import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mobile World Festival – Directorio",
  description: "Directorio de empresas tecnológicas por país y categoría",
};

export default function DirectorioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen bg-black ${inter.variable}`} style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div className="mx-auto max-w-[480px] min-h-screen bg-black">
        {children}
      </div>
    </div>
  );
}
