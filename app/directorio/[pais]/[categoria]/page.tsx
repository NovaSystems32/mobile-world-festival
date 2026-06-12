import Link from "next/link";
import { notFound } from "next/navigation";
import { getPais, getCategoria, getEmpresasByPaisAndCategoria } from "@/lib/directorio-data";
import type { Empresa } from "@/lib/directorio-data";

interface Props {
  params: Promise<{ pais: string; categoria: string }>;
}

function LogoIcon({ empresa, size = "full" }: { empresa: Empresa; size?: "full" | "sm" }) {
  const lines = empresa.logoText.split("\n");
  return (
    <div
      className={`${size === "full" ? "w-full aspect-square" : "w-14 h-14"} rounded-[22%] flex flex-col items-center justify-center shadow-lg flex-shrink-0`}
      style={{ backgroundColor: empresa.logoColor }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="text-white font-bold leading-none text-center"
          style={{ fontSize: lines.length > 1 ? (size === "sm" ? "9px" : "11px") : (size === "sm" ? "18px" : "22px") }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}

export default async function CategoriaPage({ params }: Props) {
  const { pais: paisSlug, categoria: catSlug } = await params;
  const pais = getPais(paisSlug);
  const categoria = getCategoria(catSlug);
  if (!pais || !categoria) notFound();

  const empresas = getEmpresasByPaisAndCategoria(paisSlug, catSlug);
  const destacadas = empresas.filter((e) => e.destacado);
  const premium = empresas.filter((e) => e.premium);
  const patrocinadas = empresas.filter((e) => e.patrocinado);
  const regulares = empresas.filter((e) => !e.destacado && !e.premium && !e.patrocinado);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-2">
        <Link href={`/directorio/${paisSlug}`} className="text-blue-400 text-sm font-medium">
          ← {pais.nombre}
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 pb-4">
        <p className="text-gray-400 text-sm">
          {pais.bandera} {pais.nombre} &rsaquo; {categoria.nombre}
        </p>
        <h1 className="text-2xl font-bold text-white mt-1">Empresas</h1>
      </div>

      <div className="px-3 pb-10 space-y-4">
        {/* Destacadas row */}
        {destacadas.length > 0 && (
          <div className="space-y-2">
            {destacadas.map((empresa) => (
              <Link key={empresa.slug} href={`/directorio/${paisSlug}/${catSlug}/${empresa.slug}`}>
                <div className="flex items-center gap-3 rounded-2xl p-3 border border-yellow-500/30" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="w-14 h-14 flex-shrink-0">
                    <LogoIcon empresa={empresa} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">★ DESTACADO</span>
                    </div>
                    <p className="text-white font-semibold text-sm truncate">{empresa.nombre}</p>
                    {empresa.tags && empresa.tags[0] && (
                      <p className="text-gray-400 text-xs truncate">{empresa.tags[0]} · {empresa.tags[1] ?? ""}</p>
                    )}
                  </div>
                  <span className="text-gray-500 text-lg">›</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Premium cards */}
        {premium.map((empresa) => (
          <Link key={empresa.slug} href={`/directorio/${paisSlug}/${catSlug}/${empresa.slug}`}>
            <div className="rounded-2xl p-4" style={{ backgroundColor: empresa.logoColor + "cc" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">★ PREMIUM</span>
              </div>
              <p className="text-white font-bold text-xl">{empresa.nombre}</p>
              <p className="text-white/80 text-sm mt-1">{empresa.descripcion}</p>
              <div className="mt-3">
                <span className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full inline-block">
                  Ver catálogo →
                </span>
              </div>
            </div>
          </Link>
        ))}

        {/* Patrocinadas */}
        {patrocinadas.map((empresa) => (
          <Link key={empresa.slug} href={`/directorio/${paisSlug}/${catSlug}/${empresa.slug}`}>
            <div className="rounded-2xl p-3 flex items-center gap-3" style={{ backgroundColor: "#1c2a1c" }}>
              <LogoIcon empresa={empresa} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">★ PATROCINADO</span>
                </div>
                <p className="text-white font-semibold text-sm">{empresa.nombre}</p>
                <p className="text-gray-400 text-xs truncate">{empresa.descripcion?.slice(0, 50)}...</p>
              </div>
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0">
                Contactar
              </div>
            </div>
          </Link>
        ))}

        {/* Regulares grid */}
        {regulares.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {regulares.map((empresa) => (
              <Link key={empresa.slug} href={`/directorio/${paisSlug}/${catSlug}/${empresa.slug}`}>
                <div className="flex flex-col items-center gap-1.5 relative">
                  {empresa.badge && empresa.badge > 0 ? (
                    <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {empresa.badge}
                    </div>
                  ) : null}
                  <LogoIcon empresa={empresa} />
                  <span className="text-white text-[11px] text-center leading-tight font-medium">
                    {empresa.nombre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {empresas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 text-sm">No hay empresas en esta categoría todavía</p>
            <p className="text-gray-600 text-xs mt-1">Próximamente...</p>
          </div>
        )}

        {/* Spaces available footer */}
        {empresas.length > 0 && (
          <div className="pt-4">
            <p className="text-amber-500 text-xs text-center">
              ● Espacios destacados disponibles · Consultá con tu cuenta
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
