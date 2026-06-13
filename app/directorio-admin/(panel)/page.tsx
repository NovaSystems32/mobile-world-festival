import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function DirectorioAdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: empresas } = await supabase.from("directorio_empresas").select("plan, pais, activa");
  const total = empresas?.length ?? 0;
  const activas = empresas?.filter((e) => e.activa).length ?? 0;
  const premium = empresas?.filter((e) => e.plan === "premium").length ?? 0;
  const destacadas = empresas?.filter((e) => e.plan === "destacado").length ?? 0;
  const patrocinadas = empresas?.filter((e) => e.plan === "patrocinado").length ?? 0;

  // Por país
  const porPais: Record<string, number> = {};
  empresas?.forEach((e) => {
    porPais[e.pais] = (porPais[e.pais] ?? 0) + 1;
  });
  const topPaises = Object.entries(porPais).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "Total empresas", value: total, icon: "🏢", color: "bg-blue-600" },
    { label: "Activas", value: activas, icon: "✅", color: "bg-green-600" },
    { label: "Premium", value: premium, icon: "⭐", color: "bg-yellow-600" },
    { label: "Destacadas", value: destacadas, icon: "🔝", color: "bg-purple-600" },
    { label: "Patrocinadas", value: patrocinadas, icon: "📢", color: "bg-orange-600" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Resumen del directorio</p>
        </div>
        <Link href="/directorio-admin/empresas/nueva" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          + Nueva empresa
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top países + acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="font-semibold text-white mb-4">Top países</h2>
          {topPaises.length === 0 ? (
            <p className="text-gray-500 text-sm">Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {topPaises.map(([pais, count]) => (
                <div key={pais} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm capitalize">{pais}</span>
                  <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="font-semibold text-white mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link href="/directorio-admin/empresas/nueva" className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              <span className="text-xl">➕</span>
              <div>
                <p className="text-white text-sm font-medium">Agregar empresa</p>
                <p className="text-gray-400 text-xs">Registrar un nuevo comercio</p>
              </div>
            </Link>
            <Link href="/directorio-admin/empresas" className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              <span className="text-xl">📋</span>
              <div>
                <p className="text-white text-sm font-medium">Ver todas las empresas</p>
                <p className="text-gray-400 text-xs">Gestionar el directorio completo</p>
              </div>
            </Link>
            <Link href="/directorio" target="_blank" className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              <span className="text-xl">👁️</span>
              <div>
                <p className="text-white text-sm font-medium">Ver directorio público</p>
                <p className="text-gray-400 text-xs">Cómo lo ven los usuarios</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
