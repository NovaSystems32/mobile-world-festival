"use client";

import { useState, useTransition } from "react";
import {
  Clock, Phone, Mail, User, Package, MessageCircle,
  ChevronDown, ChevronUp, Trash2, CheckCircle2,
  XCircle, PhoneCall, ShoppingBag, Search, Filter,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/orders";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:   { label: "Pendiente",   color: "#FBBF24", bg: "#2D2008", icon: <Clock className="w-3.5 h-3.5" /> },
  contacted: { label: "Contactado",  color: "#60A5FA", bg: "#0D1E36", icon: <PhoneCall className="w-3.5 h-3.5" /> },
  closed:    { label: "Cerrado",     color: "#34D399", bg: "#082019", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: "Cancelado",   color: "#F87171", bg: "#200D0D", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const STATUS_ORDER: OrderStatus[] = ["pending", "contacted", "closed", "cancelled"];

function buildWhatsAppUrl(order: Order): string {
  const lines = order.items.map(
    (i) => `• ${i.product_name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`
  );
  const msg = [
    `Hola ${order.customer_name} 👋`,
    `Te contacto desde *Mobile World Festival* en relación a tu pedido:`,
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(order.total)}*`,
    "",
    `¿Podemos coordinar la entrega?`,
  ].join("\n");
  const phone = order.customer_phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface Props { orders: Order[] }

export default function PedidosClient({ orders: initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notesEdit, setNotesEdit] = useState<{ id: string; value: string } | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      (o.customer_email || "").toLowerCase().includes(q) ||
      o.items.some((i) => i.product_name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  function handleStatusChange(id: string, status: OrderStatus) {
    setLoadingId(id);
    startTransition(async () => {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o));
      setLoadingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este pedido?")) return;
    startTransition(async () => {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    });
  }

  async function handleSaveNotes(id: string, notes: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    await updateOrderStatus(id, order.status, notes);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, notes } : o));
    setNotesEdit(null);
  }

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    contacted: orders.filter((o) => o.status === "contacted").length,
    closed: orders.filter((o) => o.status === "closed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const cellStyle = { background: "#0F1A29", border: "1px solid #1E2A3A" };

  return (
    <div className="space-y-5">
      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none"
            style={cellStyle}
          />
        </div>

        {/* Status pills */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", ...STATUS_ORDER] as const).map((s) => {
            const cfg = s === "all" ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: filter === s ? (cfg?.bg ?? "#111D2E") : "#0F1A29",
                  border: `1px solid ${filter === s ? (cfg?.color ?? "#3B82F6") : "#1E2A3A"}`,
                  color: filter === s ? (cfg?.color ?? "#60A5FA") : "#64748B",
                }}
              >
                {cfg ? <>{cfg.icon}{cfg.label}</> : <><Filter className="w-3.5 h-3.5" />Todos</>}
                <span className="px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: "rgba(255,255,255,0.08)" }}>
                  {s === "all" ? counts.all : counts[s]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl" style={{ background: "#0F1A29", border: "1px solid #1E2A3A" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#111D2E" }}>
            <ShoppingBag className="w-7 h-7" style={{ color: "#334155" }} />
          </div>
          <div className="text-center">
            <p className="font-semibold" style={{ color: "#64748B" }}>No hay pedidos</p>
            <p className="text-sm mt-1" style={{ color: "#334155" }}>
              {search || filter !== "all" ? "Intentá con otro filtro" : "Los pedidos del carrito aparecerán aquí"}
            </p>
          </div>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const cfg = STATUS_CONFIG[order.status];
          const isExpanded = expanded === order.id;
          const isLoading = loadingId === order.id;

          return (
            <div key={order.id} className="rounded-2xl overflow-hidden transition-all" style={{ background: "#0F1A29", border: "1px solid #1E2A3A" }}>
              {/* Row header */}
              <div className="flex items-center gap-3 px-4 py-3.5">
                {/* Status dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />

                {/* Customer */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "#F1F5F9" }}>{order.customer_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs flex items-center gap-1" style={{ color: "#64748B" }}>
                      <Phone className="w-3 h-3" />{order.customer_phone}
                    </span>
                    {order.customer_email && (
                      <span className="text-xs flex items-center gap-1" style={{ color: "#64748B" }}>
                        <Mail className="w-3 h-3" />{order.customer_email}
                      </span>
                    )}
                    <span className="text-xs flex items-center gap-1" style={{ color: "#64748B" }}>
                      <Package className="w-3 h-3" />{order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs" style={{ color: "#475569" }}>{formatDate(order.created_at)}</span>
                  </div>
                </div>

                {/* Total */}
                <span className="text-sm font-bold flex-shrink-0" style={{ color: "#60A5FA", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {formatPrice(order.total)}
                </span>

                {/* WhatsApp */}
                <a
                  href={buildWhatsAppUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Contactar por WhatsApp"
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
                  style={{ background: "#082019", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#111D2E", color: "#64748B" }}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4" style={{ borderTop: "1px solid #1E2A3A" }}>
                  {/* Products */}
                  <div className="pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Productos</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "#0B1120" }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{item.product_name}</p>
                            <p className="text-xs" style={{ color: "#64748B" }}>{formatPrice(item.price)} c/u × {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold" style={{ color: "#A78BFA" }}>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Status change */}
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Cambiar estado</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_ORDER.map((s) => {
                          const c = STATUS_CONFIG[s];
                          return (
                            <button
                              key={s}
                              disabled={order.status === s || isLoading}
                              onClick={() => handleStatusChange(order.id, s)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                              style={{
                                background: order.status === s ? c.bg : "#0B1120",
                                border: `1px solid ${order.status === s ? c.color : "#1E2A3A"}`,
                                color: order.status === s ? c.color : "#64748B",
                                cursor: order.status === s ? "default" : "pointer",
                              }}
                            >
                              {c.icon}{c.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="flex items-end">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                        style={{ background: "#200D0D", border: "1px solid rgba(248,113,113,0.20)", color: "#F87171" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Notas internas</p>
                    {notesEdit?.id === order.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesEdit.value}
                          onChange={(e) => setNotesEdit({ id: order.id, value: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none resize-none"
                          style={{ background: "#0B1120", border: "1px solid rgba(59,130,246,0.40)" }}
                          placeholder="Agregar nota..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNotes(order.id, notesEdit.value)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                            style={{ background: "#0D1E36", border: "1px solid #3B82F6", color: "#60A5FA" }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setNotesEdit(null)}
                            className="px-3 py-1.5 rounded-lg text-xs"
                            style={{ color: "#475569" }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setNotesEdit({ id: order.id, value: order.notes || "" })}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                        style={{ background: "#0B1120", border: "1px solid #1E2A3A", color: order.notes ? "#94A3B8" : "#475569" }}
                      >
                        {order.notes || "Hacer clic para agregar una nota..."}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
