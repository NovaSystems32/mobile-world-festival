import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/directorio-admin/login");

  const navItems = [
    { href: "/directorio-admin", label: "Dashboard", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { href: "/directorio-admin/empresas", label: "Empresas", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { href: "/directorio-admin/empresas/nueva", label: "Nueva empresa", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    )},
  ];

  return (
    <div
      className={`min-h-screen ${inter.variable}`}
      style={{
        fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
        background: "linear-gradient(135deg, #050814 0%, #0a0f1e 50%, #050814 100%)",
      }}
    >
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="w-60 min-h-screen fixed flex flex-col border-r"
          style={{
            background: "rgba(10, 15, 30, 0.85)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {/* Logo */}
          <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #3B82F6, #6366f1)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Directorio</p>
                <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.35)" }}>Mobile World Festival</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              Panel
            </p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <span className="transition-colors duration-150 group-hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {item.icon}
                </span>
                <span className="group-hover:text-white transition-colors duration-150">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Link
              href="/directorio"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-white transition-colors">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="group-hover:text-white transition-colors">Ver directorio</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-60 flex-1 min-h-screen p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
