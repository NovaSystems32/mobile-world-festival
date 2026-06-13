import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

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

  const porPais: Record<string, number> = {};
  empresas?.forEach((e) => { porPais[e.pais] = (porPais[e.pais] ?? 0) + 1; });
  const topPaises = Object.entries(porPais).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "Total", value: total, gradient: "linear-gradient(135deg, #3B82F6, #6366f1)", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { label: "Activas", value: activas, gradient: "linear-gradient(135deg, #10b981, #059669)", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    )},
    { label: "Premium", value: premium, gradient: "linear-gradient(135deg, #f59e0b, #d97706)", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    )},
    { label: "Destacadas", value: destacadas, gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
    )},
    { label: "Patrocinadas", value: patrocinadas, gradient: "linear-gradient(135deg, #f97316, #ea580c)", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.08-1.08a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.9z"/></svg>
    )},
  ];

  const quickActions = [
    {
      href: "/directorio-admin/empresas/nueva",
      label: "Agregar empresa",
      desc: "Registrar un nuevo comercio",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
    {
      href: "/directorio-admin/empresas",
      label: "Ver todas las empresas",
      desc: "Gestionar el directorio completo",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
    {
      href: "/directorio",
      label: "Ver directorio público",
      desc: "Cómo lo ven los usuarios",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Panel</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>
        <Link
          href="/directorio-admin/empresas/nueva"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #3B82F6, #6366f1)" }}
        >
          <span className="text-base leading-none">+</span> Nueva empresa
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl p-5" style={glass}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: s.gradient }}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{s.value}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top países */}
        <div className="rounded-2xl p-6" style={glass}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Top países</p>
          {topPaises.length === 0 ? (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Sin datos aún</p>
          ) : (
            <div className="space-y-3">
              {topPaises.map(([pais, count]) => (
                <div key={pais} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-white/70">{pais}</span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="rounded-2xl p-6" style={glass}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Acciones rápidas</p>
          <div className="space-y-2">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">{a.label}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
