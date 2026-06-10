"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, BarChart3, Tag, LogOut, ExternalLink,
  MessageSquare, Percent,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navSections = [
  {
    label: "Principal",
    items: [
      { href: "/admin",            icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Inventario",
    items: [
      { href: "/admin/productos",  icon: Package,         label: "Productos" },
      { href: "/admin/stock",      icon: BarChart3,       label: "Stock"     },
      { href: "/admin/categorias", icon: Tag,             label: "Categorías"},
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/cupones",    icon: Percent,         label: "Cupones"   },
    ],
  },
  {
    label: "Comunicación",
    items: [
      { href: "/admin/contactos",  icon: MessageSquare,   label: "Mensajes"  },
    ],
  },
];

export default function Sidebar({ unreadMessages = 0 }: { unreadMessages?: number }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className="w-[200px] flex-shrink-0 h-screen sticky top-0 flex flex-col"
      style={{
        background: "#0B1120",
        borderRight: "1px solid #1E2A3A",
      }}
    >
      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: "1px solid #1A2840" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.30) 0%, rgba(10,15,30,0.90) 70%)",
              border: "1.5px solid rgba(59,130,246,0.35)",
              boxShadow: "0 0 16px rgba(59,130,246,0.20)",
            }}
          >
            <div className="relative w-6 h-6">
              <Image src="/logo.png" alt="Mobile World" fill className="object-contain" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#F1F5F9",
                letterSpacing: "-0.02em",
              }}
            >
              Mobile World
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "9px",
                fontWeight: 500,
                color: "#00D4FF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map(({ label, items }) => (
          <div key={label}>
            <p
              className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "#334155" }}
            >
              {label}
            </p>
            <div className="space-y-0.5">
              {items.map(({ href, icon: Icon, label: itemLabel }) => {
                const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                const isMensajes = href === "/admin/contactos";
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all relative"
                    style={
                      active
                        ? {
                            background: "rgba(59,130,246,0.15)",
                            color: "#60A5FA",
                            borderLeft: "2px solid #3B82F6",
                          }
                        : { color: "#64748B" }
                    }
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: active ? "#60A5FA" : "#475569" }}
                    />
                    <span className="flex-1">{itemLabel}</span>
                    {isMensajes && unreadMessages > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none flex-shrink-0"
                        style={{ background: "#22D3EE", color: "#0A0F1E" }}
                      >
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="p-2 space-y-0.5"
        style={{ borderTop: "1px solid #1A2840" }}
      >
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all"
          style={{ color: "#64748B" }}
        >
          <ExternalLink className="w-4 h-4" style={{ color: "#475569" }} />
          Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all"
          style={{ color: "#64748B" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "#EF4444";
            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "#64748B";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut className="w-4 h-4" style={{ color: "#475569" }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
