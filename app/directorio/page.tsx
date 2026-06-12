import Link from "next/link";
import { paises } from "@/lib/directorio-data";

export default function DirectorioHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-3xl font-bold text-white">🌎 Directorio</h1>
        <p className="text-gray-400 mt-1 text-sm">Seleccioná un país para explorar empresas</p>
      </div>

      {/* Countries Grid */}
      <div className="px-3 pb-10">
        <div className="grid grid-cols-4 gap-3">
          {paises.map((pais) => (
            <Link key={pais.slug} href={`/directorio/${pais.slug}`}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-full aspect-square rounded-[22%] flex items-center justify-center text-4xl shadow-lg"
                  style={{ backgroundColor: pais.color + "33", border: `2px solid ${pais.color}44` }}
                >
                  <span style={{ fontSize: "2rem" }}>{pais.bandera}</span>
                </div>
                <span className="text-white text-[11px] text-center leading-tight font-medium">
                  {pais.nombre}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 px-4">
        <p className="text-gray-600 text-xs">Mobile World Festival © 2024</p>
      </div>
    </div>
  );
}
