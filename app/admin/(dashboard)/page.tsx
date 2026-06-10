import Link from "next/link";
import { getDashboardStats, getRecentProducts } from "@/lib/actions/products";
import { getContactMessages, getUnreadCount } from "@/lib/actions/contact";
import { formatPrice } from "@/lib/utils";
import {
  Package, CheckCircle2, XCircle, Star, AlertTriangle,
  Plus, BarChart3, Tag, MessageSquare, Percent,
  TrendingUp, ArrowRight, Eye,
} from "lucide-react";

export default async function AdminDashboard() {
  const [stats, unread, messages, recent] = await Promise.all([
    getDashboardStats(),
    getUnreadCount(),
    getContactMessages(),
    getRecentProducts(5),
  ]);

  const cards = [
    {
      label: "Total productos",
      value: stats.total,
      icon: Package,
      color: "#3B82F6",
      glow: "rgba(59,130,246,0.15)",
      bg: "rgba(59,130,246,0.12)",
    },
    {
      label: "Activos",
      value: stats.active,
      icon: CheckCircle2,
      color: "#22C55E",
      glow: "rgba(34,197,94,0.15)",
      bg: "rgba(34,197,94,0.12)",
    },
    {
      label: "Sin stock",
      value: stats.out_of_stock,
      icon: XCircle,
      color: "#EF4444",
      glow: "rgba(239,68,68,0.15)",
      bg: "rgba(239,68,68,0.12)",
    },
    {
      label: "Stock bajo",
      value: stats.low_stock,
      icon: AlertTriangle,
      color: "#F59E0B",
      glow: "rgba(245,158,11,0.15)",
      bg: "rgba(245,158,11,0.12)",
    },
    {
      label: "Destacados",
      value: stats.featured,
      icon: Star,
      color: "#A78BFA",
      glow: "rgba(167,139,250,0.15)",
      bg: "rgba(167,139,250,0.12)",
    },
    {
      label: "Mensajes nuevos",
      value: unread,
      icon: MessageSquare,
      color: "#22D3EE",
      glow: "rgba(34,211,238,0.15)",
      bg: "rgba(34,211,238,0.12)",
    },
  ];

  const quickLinks = [
    {
      href: "/admin/productos/nuevo",
      icon: Plus,
      label: "Nuevo producto",
      desc: "Agregar equipo al catálogo",
      color: "#3B82F6",
    },
    {
      href: "/admin/stock",
      icon: BarChart3,
      label: "Actualizar stock",
      desc: "Gestionar disponibilidad",
      color: "#22C55E",
    },
    {
      href: "/admin/categorias",
      icon: Tag,
      label: "Categorías",
      desc: "Crear y editar categorías",
      color: "#A78BFA",
    },
    {
      href: "/admin/cupones",
      icon: Percent,
      label: "Cupones",
      desc: "Descuentos y promociones",
      color: "#F59E0B",
    },
    {
      href: "/admin/contactos",
      icon: MessageSquare,
      label: "Mensajes",
      desc: `${unread} sin leer`,
      color: "#22D3EE",
    },
  ];

  const recentMessages = (messages as {
    id: string; name: string; phone?: string; message: string; is_read: boolean; created_at: string;
  }[]).slice(0, 4);

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-bold text-2xl text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Resumen del negocio · Mobile World Festival
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
            boxShadow: "0 4px 16px rgba(59,130,246,0.30)",
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(({ label, value, icon: Icon, color, glow, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "#111D2E",
              border: "1px solid #1C2B3E",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <p
              className="font-bold text-2xl leading-none"
              style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {value}
            </p>
            <p className="text-[#64748B] text-xs mt-1.5 leading-snug">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Quick actions */}
        <div
          className="lg:col-span-1 rounded-2xl p-5 space-y-4"
          style={{
            background: "#111D2E",
            border: "1px solid #1C2B3E",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-white font-semibold text-sm">Acciones rápidas</h2>
          </div>
          <div className="space-y-2">
            {quickLinks.map(({ href, icon: Icon, label, desc, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all group"
                style={{ background: "#0F1A29", border: "1px solid #182438" }}
                onMouseEnter={undefined}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-[#64748B] text-[11px]">{desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#334155] group-hover:text-[#64748B] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div
          className="lg:col-span-2 rounded-2xl p-5 space-y-4"
          style={{
            background: "#111D2E",
            border: "1px solid #1C2B3E",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
              <h2 className="text-white font-semibold text-sm">Mensajes recientes</h2>
              {unread > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE" }}
                >
                  {unread} nuevos
                </span>
              )}
            </div>
            <Link
              href="/admin/contactos"
              className="text-[#3B82F6] hover:text-[#60A5FA] text-xs font-medium transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center text-[#334155] text-sm">
              No hay mensajes todavía.
            </div>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/admin/contactos"
                  className="flex items-start gap-3 p-3 rounded-xl transition-all"
                  style={{ background: "#0F1A29", border: "1px solid #182438" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5"
                    style={{
                      background: msg.is_read ? "rgba(100,116,139,0.15)" : "rgba(34,211,238,0.15)",
                      color: msg.is_read ? "#64748B" : "#22D3EE",
                    }}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-xs font-semibold truncate">{msg.name}</p>
                      {!msg.is_read && (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: "#22D3EE" }}
                        />
                      )}
                    </div>
                    <p className="text-[#64748B] text-[11px] truncate mt-0.5">{msg.message}</p>
                  </div>
                  <p className="text-[#334155] text-[10px] flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent products */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#111D2E",
          border: "1px solid #1C2B3E",
        }}
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#3B82F6]" />
            <h2 className="text-white font-semibold text-sm">Productos recientes</h2>
          </div>
          <Link href="/admin/productos" className="text-[#3B82F6] hover:text-[#60A5FA] text-xs font-medium transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Producto", "Precio", "Stock", "Estado"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recent.map((p: { id: string; name: string; price: number; stock: number; is_active: boolean; condition: string }) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-[#475569] text-xs capitalize">
                      {p.condition === "new" ? "Nuevo" : p.condition === "used" ? "Usado" : "Reacondicionado"}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-white text-sm font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className="text-sm font-bold"
                      style={{ color: p.stock === 0 ? "#EF4444" : p.stock <= 3 ? "#F59E0B" : "#22C55E" }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: p.is_active ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        color: p.is_active ? "#22C55E" : "#EF4444",
                      }}
                    >
                      {p.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && (
            <div className="py-12 text-center text-[#475569] text-sm">
              No hay productos.{" "}
              <Link href="/admin/productos/nuevo" className="text-[#3B82F6] hover:underline">
                Crear el primero
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stock alert banner */}
      {(stats.out_of_stock > 0 || stats.low_stock > 0) && (
        <div
          className="flex items-start gap-4 p-4 rounded-2xl"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)" }}
        >
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[#F59E0B] font-semibold text-sm">
              Alerta de inventario
            </p>
            <p className="text-[#92400E] text-xs mt-0.5 text-[#78350F]" style={{ color: "#B45309" }}>
              {stats.out_of_stock > 0 && `${stats.out_of_stock} sin stock · `}
              {stats.low_stock > 0 && `${stats.low_stock} con stock bajo`}
            </p>
          </div>
          <Link
            href="/admin/stock"
            className="text-[#F59E0B] text-sm font-semibold hover:underline flex-shrink-0"
          >
            Ver stock →
          </Link>
        </div>
      )}
    </div>
  );
}
