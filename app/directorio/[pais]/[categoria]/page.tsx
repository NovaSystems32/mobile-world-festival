import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPais, getCategoria, getEmpresasByPaisAndCategoria } from "@/lib/directorio-data";
import type { Empresa } from "@/lib/directorio-data";

interface Props {
  params: Promise<{ pais: string; categoria: string }>;
}

interface EmpresaDB {
  id: string;
  slug: string;
  nombre: string;
  logo_color: string;
  logo_texto: string;
  plan: string;
  badge: number;
  descripcion: string;
  tags: string[];
  whatsapp: string;
}

function LogoIcon({ color, texto, nombre, size = "full" }: { color: string; texto: string; nombre: string; size?: "full" | "sm" }) {
  const display = texto || nombre.slice(0, 2).toUpperCase();
  return (
    <div
      className={`${size === "full" ? "w-full aspect-square" : "w-14 h-14"} rounded-[22%] flex flex-col items-center justify-center shadow-lg flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      <span className="text-white font-bold leading-none text-center" style={{ fontSize: size === "sm" ? "14px" : "18px" }}>
        {display}
      </span>
    </div>
  );
}

export default async function CategoriaPage({ params }: Props) {
  const { pais: paisSlug, categoria: catSlug } = await params;
  const pais = getPais(paisSlug);
  const categoria = getCategoria(catSlug);
  if (!pais || !categoria) notFound();

  // Intentar leer de Supabase primero
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: dbEmpresas } = await supabase
    .from("directorio_empresas")
    .select("id, slug, nombre, logo_color, logo_texto, plan, badge, descripcion, tags, whatsapp")
    .eq("pais", paisSlug)
    .eq("categoria", catSlug)
    .eq("activa", true)
    .order("created_at", { ascending: false });

  // Si hay datos en DB usarlos, sino usar datos estáticos
  const useDB = dbEmpresas && dbEmpresas.length > 0;

  let destacadas: (EmpresaDB | Empresa)[] = [];
  let premium: (EmpresaDB | Empresa)[] = [];
  let patrocinadas: (EmpresaDB | Empresa)[] = [];
  let regulares: (EmpresaDB | Empresa)[] = [];

  if (useDB) {
    destacadas = dbEmpresas.filter((e) => e.plan === "destacado");
    premium = dbEmpresas.filter((e) => e.plan === "premium");
    patrocinadas = dbEmpresas.filter((e) => e.plan === "patrocinado");
    regulares = dbEmpresas.filter((e) => e.plan === "regular");
  } else {
    const staticEmpresas = getEmpresasByPaisAndCategoria(paisSlug, catSlug);
    destacadas = staticEmpresas.filter((e) => e.destacado);
    premium = staticEmpresas.filter((e) => e.premium);
    patrocinadas = staticEmpresas.filter((e) => e.patrocinado);
    regulares = staticEmpresas.filter((e) => !e.destacado && !e.premium && !e.patrocinado);
  }

  const allEmpresas = [...destacadas, ...premium, ...patrocinadas, ...regulares];

  function getSlug(e: EmpresaDB | Empresa) { return (e as EmpresaDB).slug ?? (e as Empresa).slug; }
  function getNombre(e: EmpresaDB | Empresa) { return (e as EmpresaDB).nombre ?? (e as Empresa).nombre; }
  function getColor(e: EmpresaDB | Empresa) { return (e as EmpresaDB).logo_color ?? (e as Empresa).logoColor; }
  function getTexto(e: EmpresaDB | Empresa) { return (e as EmpresaDB).logo_texto ?? (e as Empresa).logoText ?? ""; }
  function getBadge(e: EmpresaDB | Empresa) { return (e as EmpresaDB).badge ?? (e as Empresa).badge ?? 0; }
  function getDesc(e: EmpresaDB | Empresa) { return (e as EmpresaDB).descripcion ?? (e as Empresa).descripcion ?? ""; }
  function getTags(e: EmpresaDB | Empresa) { return (e as EmpresaDB).tags ?? (e as Empresa).tags ?? []; }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center gap-3 px-4 pt-12 pb-2">
        <Link href={`/directorio/${paisSlug}`} className="text-blue-400 text-sm font-medium">← {pais.nombre}</Link>
      </div>
      <div className="px-4 pb-4">
        <p className="text-gray-400 text-sm">{pais.bandera} {pais.nombre} › {categoria.nombre}</p>
        <h1 className="text-2xl font-bold text-white mt-1">Empresas</h1>
      </div>
      <div className="px-3 pb-10 space-y-4">
        {destacadas.length > 0 && (
          <div className="space-y-2">
            {destacadas.map((empresa) => (
              <Link key={getSlug(empresa)} href={`/directorio/${paisSlug}/${catSlug}/${getSlug(empresa)}`}>
                <div className="flex items-center gap-3 rounded-2xl p-3 border border-yellow-500/30" style={{ backgroundColor: "#1a1a1a" }}>
                  <div className="w-14 h-14 flex-shrink-0"><LogoIcon color={getColor(empresa)} texto={getTexto(empresa)} nombre={getNombre(empresa)} size="sm" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">★ DESTACADO</span>
                    </div>
                    <p className="text-white font-semibold text-sm truncate">{getNombre(empresa)}</p>
                    {getTags(empresa)[0] && <p className="text-gray-400 text-xs truncate">{getTags(empresa)[0]} · {getTags(empresa)[1] ?? ""}</p>}
                  </div>
                  <span className="text-gray-500 text-lg">›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {premium.map((empresa) => (
          <Link key={getSlug(empresa)} href={`/directorio/${paisSlug}/${catSlug}/${getSlug(empresa)}`}>
            <div className="rounded-2xl p-4" style={{ backgroundColor: getColor(empresa) + "cc" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">★ PREMIUM</span>
              </div>
              <p className="text-white font-bold text-xl">{getNombre(empresa)}</p>
              <p className="text-white/80 text-sm mt-1">{getDesc(empresa)}</p>
              <div className="mt-3">
                <span className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full inline-block">Ver catálogo →</span>
              </div>
            </div>
          </Link>
        ))}
        {patrocinadas.map((empresa) => (
          <Link key={getSlug(empresa)} href={`/directorio/${paisSlug}/${catSlug}/${getSlug(empresa)}`}>
            <div className="rounded-2xl p-3 flex items-center gap-3" style={{ backgroundColor: "#1c2a1c" }}>
              <LogoIcon color={getColor(empresa)} texto={getTexto(empresa)} nombre={getNombre(empresa)} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">★ PATROCINADO</span>
                </div>
                <p className="text-white font-semibold text-sm">{getNombre(empresa)}</p>
                <p className="text-gray-400 text-xs truncate">{getDesc(empresa).slice(0, 50)}...</p>
              </div>
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0">Contactar</div>
            </div>
          </Link>
        ))}
        {regulares.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {regulares.map((empresa) => (
              <Link key={getSlug(empresa)} href={`/directorio/${paisSlug}/${catSlug}/${getSlug(empresa)}`}>
                <div className="flex flex-col items-center gap-1.5 relative">
                  {getBadge(empresa) > 0 && (
                    <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {getBadge(empresa)}
                    </div>
                  )}
                  <LogoIcon color={getColor(empresa)} texto={getTexto(empresa)} nombre={getNombre(empresa)} />
                  <span className="text-white text-[11px] text-center leading-tight font-medium">{getNombre(empresa)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {allEmpresas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 text-sm">No hay empresas en esta categoría todavía</p>
          </div>
        )}
        {allEmpresas.length > 0 && (
          <div className="pt-4">
            <p className="text-amber-500 text-xs text-center">● Espacios destacados disponibles · Consultá con tu cuenta</p>
          </div>
        )}
      </div>
    </div>
  );
}
