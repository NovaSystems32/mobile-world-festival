import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile World Festival – Directorio",
  description: "Directorio de empresas tecnológicas por país y categoría",
};

export default function DirectorioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="mx-auto max-w-[480px] min-h-screen bg-black">
        {children}
      </div>
    </div>
  );
}
