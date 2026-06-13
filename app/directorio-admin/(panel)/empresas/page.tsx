import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import EmpresaActions from "./EmpresaActions";

export default async function EmpresasPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: empresas } = await supabase
    .from("directorio_empresas")
    .select("*")
    .order("created_at", { ascending: false });

  const planColors: Record<string, string> = {
    regular: "bg-gray-700 text-gray-300",
    destacado: "bg-yellow-600/20 text-yellow-400",
    premium: "bg-purple-600/20 text-purple-400",
    patrocinado: "bg-orange-600/20 text-orange-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Empresas</h1>
          <p className="text-gray-400 text-sm mt-1">{empresas?.length ?? 0} registradas</p>
        </div>
        <Link href="/directorio-admin/empresas/nueva" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          + Nueva empresa
        </Link>
      </div>

      {(!empresas || empresas.length === 0) ? (
        <div className="bg-gray-900 rounded-2xl p-16 text-center border border-gray-800">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-white font-semibold">No hay empresas todavía</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">Agregá la primera empresa al directorio</p>
          <Link href="/directorio-admin/empresas/nueva" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            + Agregar empresa
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase">Empresa</th>
                <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase">País</th>
                <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase">Categoría</th>
                <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase">Plan</th>
                <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase">Estado</th>
                <th className="text-right px-6 py-4 text-gray-400 text-xs font-semibold uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {empresas.map((e) => (
                <tr key={e.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: e.logo_color }}>
                        {(e.logo_texto || e.nombre).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{e.nombre}</p>
                        {e.whatsapp && <p className="text-gray-500 text-xs">{e.telefono}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm capitalize">{e.pais}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm capitalize">{e.categoria}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${planColors[e.plan] ?? planColors.regular}`}>
                      {e.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${e.activa ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                      {e.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <EmpresaActions id={e.id} activa={e.activa} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
