import Link from "next/link";
import { notFound } from "next/navigation";
import { getPais, categorias } from "@/lib/directorio-data";

interface Props {
  params: Promise<{ pais: string }>;
}

export default async function PaisPage({ params }: Props) {
  const { pais: paisSlug } = await params;
  const pais = getPais(paisSlug);
  if (!pais) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-2">
        <Link href="/directorio" className="text-blue-400 text-sm font-medium">
          ← Países
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 pb-4">
        <p className="text-gray-400 text-sm">
          {pais.bandera} {pais.nombre}
        </p>
        <h1 className="text-2xl font-bold text-white mt-1">Categorías</h1>
      </div>

      {/* Categories Grid */}
      <div className="px-3 pb-10">
        <div className="grid grid-cols-4 gap-3">
          {categorias.map((cat) => (
            <Link key={cat.slug} href={`/directorio/${paisSlug}/${cat.slug}`}>
              <div className="flex flex-col items-center gap-1.5 relative">
                {/* Badge */}
                {cat.badge && cat.badge > 0 ? (
                  <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cat.badge > 99 ? "99+" : cat.badge}
                  </div>
                ) : null}
                <div
                  className="w-full aspect-square rounded-[22%] flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: cat.color }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{cat.emoji}</span>
                </div>
                <span className="text-white text-[11px] text-center leading-tight font-medium">
                  {cat.nombre}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
