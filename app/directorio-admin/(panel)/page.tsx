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

  const { data: empresas } = await supabase
    .from("directorio_empresas")
    .select("id, nombre, pais, categoria, plan, activa, logo_color, logo_texto, created_at")
    .order("created_at", { ascending: false });

  const total = empresas?.length ?? 0;
  const activas = empresas?.filter((e) => e.activa).length ?? 0;
  const premium = empresas?.filter((e) => e.plan === "premium").length ?? 0;
  const destacadas = empresas?.filter((e) => e.plan === "destacado").length ?? 0;
  const patrocinadas = empresas?.filter((e) => e.plan === "patrocinado").length ?? 0;
  const recientes = empresas?.slice(0, 5) ?? [];

  const porPais: Record<string, number> = {};
  empresas?.forEach((e) => { porPais[e.pais] = (porPais[e.pais] ?? 0) + 1; });
  const topPaises = Object.entries(porPais).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxPais = topPaises[0]?.[1] ?? 1;

  const planLabel: Record<string, { label: string; color: string }> = {
    regular:     { label: "Regular",     color: "rgba(255,255,255,0.3)" },
    destacado:   { label: "Destacado",   color: "#fbbf24" },
    premium:     { label: "Premium",     color: "#a78bfa" },
    patrocinado: { label: "Patrocinado", color: "#fb923c" },
  };

  const paiFlags: Record<string, string> = {
    argentina:"ar", bolivia:"bo", brasil:"br", chile:"cl", china:"cn",
    colombia:"co", costarica:"cr", cuba:"cu", ecuador:"ec", elsalvador:"sv",
    guatemala:"gt", honduras:"hn", mexico:"mx", nicaragua:"ni", panama:"pa",
    paraguay:"py", peru:"pe", puertorico:"pr", repdom:"do", uruguay:"uy", venezuela:"ve",
  };

  const surf = "rgba(255,255,255,0.04)";
  const border = "1px solid rgba(255,255,255,0.07)";

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3" style={{ background: "rgba(91,140,255,0.12)", color: "#5B8CFF", border: "1px solid rgba(91,140,255,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            Panel
          </span>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-none">Dashboard</h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Resumen general del directorio · {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/directorio-admin/empresas/nueva"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white mt-1 transition-all duration-150 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #5B8CFF 0%, #7c5bf5 100%)",
            boxShadow: "0 4px 20px rgba(91,140,255,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva empresa
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total", value: total, sub: "empresas", gradient: "linear-gradient(135deg,#5B8CFF,#7c5bf5)", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          )},
          { label: "Activas", value: activas, sub: `${total > 0 ? Math.round(activas/total*100) : 0}% del total`, gradient: "linear-gradient(135deg,#10b981,#059669)", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          )},
          { label: "Premium", value: premium, sub: "plan premium", gradient: "linear-gradient(135deg,#f59e0b,#d97706)", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          )},
          { label: "Destacadas", value: destacadas, sub: "plan destacado", gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          )},
          { label: "Patrocinadas", value: patrocinadas, sub: "plan patrocinado", gradient: "linear-gradient(135deg,#f97316,#ea580c)", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.08-1.08a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.9z"/></svg>
          )},
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: surf, border, backdropFilter: "blur(16px)" }}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.gradient }}>
                {s.icon}
              </div>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 rounded-full" style={{ height: `${8 + i * 4}px`, background: i < 2 ? s.gradient : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight leading-none">{s.value}</p>
              <p className="text-[11px] font-medium mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.sub}</p>
            </div>
            <div className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top países — col 1 */}
        <div className="rounded-2xl p-6" style={{ background: surf, border, backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-white">Top países</p>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
              {topPaises.length} activos
            </span>
          </div>
          {topPaises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Sin datos aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topPaises.map(([pais, count]) => (
                <div key={pais}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {paiFlags[pais] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`https://flagcdn.com/w40/${paiFlags[pais]}.png`} alt={pais} className="w-5 h-4 rounded object-cover" />
                      )}
                      <span className="text-sm font-medium capitalize text-white/70">{pais}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#5B8CFF" }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxPais) * 100}%`, background: "linear-gradient(90deg,#5B8CFF,#7c5bf5)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimas empresas — col 2 */}
        <div className="rounded-2xl p-6" style={{ background: surf, border, backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-white">Últimas empresas</p>
            <Link href="/directorio-admin/empresas" className="text-xs font-semibold transition-colors hover:text-white" style={{ color: "#5B8CFF" }}>
              Ver todas →
            </Link>
          </div>
          {recientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Sin empresas aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recientes.map((e) => (
                <Link key={e.id} href={`/directorio-admin/empresas/${e.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 hover:bg-white/[0.04] group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg" style={{ background: e.logo_color }}>
                      {(e.logo_texto || e.nombre).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">{e.nombre}</p>
                      <p className="text-xs capitalize truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{e.pais} · {e.categoria}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: (planLabel[e.plan] ?? planLabel.regular).color, background: "rgba(255,255,255,0.06)" }}>
                      {(planLabel[e.plan] ?? planLabel.regular).label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas — col 3 */}
        <div className="rounded-2xl p-6 flex flex-col" style={{ background: surf, border, backdropFilter: "blur(16px)" }}>
          <p className="text-sm font-semibold text-white mb-5">Acciones rápidas</p>
          <div className="flex flex-col gap-3 flex-1">
            {[
              {
                href: "/directorio-admin/empresas/nueva",
                title: "Agregar empresa",
                desc: "Registrar nuevo comercio",
                gradient: "linear-gradient(135deg,#5B8CFF,#7c5bf5)",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                ),
              },
              {
                href: "/directorio-admin/empresas",
                title: "Gestionar empresas",
                desc: "Ver y editar el directorio",
                gradient: "linear-gradient(135deg,#10b981,#059669)",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                ),
              },
              {
                href: "/directorio",
                title: "Ver directorio público",
                desc: "Vista de los usuarios",
                gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ),
              },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-150 hover:-translate-y-0.5 group flex-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105" style={{ background: a.gradient }}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{a.desc}</p>
                </div>
                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>

          {/* Mini stats footer */}
          <div className="mt-5 pt-5 grid grid-cols-2 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{total > 0 ? Math.round(activas/total*100) : 0}%</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Tasa activas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{premium + destacadas + patrocinadas}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Planes pagos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
