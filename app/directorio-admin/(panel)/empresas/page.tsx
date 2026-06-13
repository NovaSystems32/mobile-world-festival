import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import EmpresaActions from "./EmpresaActions";

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

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

  const planBadge: Record<string, { label: string; style: React.CSSProperties }> = {
    regular:     { label: "Regular",     style: { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" } },
    destacado:   { label: "Destacado",   style: { background: "rgba(245,158,11,0.15)", color: "#fbbf24" } },
    premium:     { label: "Premium",     style: { background: "rgba(139,92,246,0.15)", color: "#a78bfa" } },
    patrocinado: { label: "Patrocinado", style: { background: "rgba(249,115,22,0.15)", color: "#fb923c" } },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Panel</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Empresas</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{empresas?.length ?? 0} registradas</p>
        </div>
        <Link
          href="/directorio-admin/empresas/nueva"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #3B82F6, #6366f1)" }}
        >
          <span className="text-base leading-none">+</span> Nueva empresa
        </Link>
      </div>

      {(!empresas || empresas.length === 0) ? (
        <div className="rounded-2xl p-16 text-center" style={glass}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(59,130,246,0.1)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <p className="text-white font-semibold text-lg mb-1">No hay empresas todavía</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>Agregá la primera empresa al directorio</p>
          <Link href="/directorio-admin/empresas/nueva" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #3B82F6, #6366f1)" }}>
            + Agregar empresa
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={glass}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Empresa</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>País</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Categoría</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Plan</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Estado</th>
                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e, i) => (
                <tr
                  key={e.id}
                  className="transition-colors duration-100 hover:bg-white/[0.03]"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg" style={{ backgroundColor: e.logo_color }}>
                        {(e.logo_texto || e.nombre).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{e.nombre}</p>
                        {e.telefono && <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{e.telefono}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize" style={{ color: "rgba(255,255,255,0.6)" }}>{e.pais}</td>
                  <td className="px-6 py-4 text-sm capitalize" style={{ color: "rgba(255,255,255,0.6)" }}>{e.categoria}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize" style={(planBadge[e.plan] ?? planBadge.regular).style}>
                      {(planBadge[e.plan] ?? planBadge.regular).label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={e.activa ? { background: "rgba(16,185,129,0.15)", color: "#34d399" } : { background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
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
