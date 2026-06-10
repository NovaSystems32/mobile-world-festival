import { getOrders } from "@/lib/actions/orders";
import PedidosClient from "@/components/admin/PedidosClient";
import { ShoppingBag, Clock, PhoneCall, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function PedidosPage() {
  const orders = await getOrders();

  const total     = orders.length;
  const pending   = orders.filter((o) => o.status === "pending").length;
  const contacted = orders.filter((o) => o.status === "contacted").length;
  const closed    = orders.filter((o) => o.status === "closed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const revenue   = orders.filter((o) => o.status === "closed").reduce((s, o) => s + o.total, 0);

  const statCards = [
    { label: "Total pedidos",  value: String(total),             icon: <ShoppingBag className="w-5 h-5" />, color: "#60A5FA", bg: "#0D1E36" },
    { label: "Pendientes",     value: String(pending),           icon: <Clock className="w-5 h-5" />,       color: "#FBBF24", bg: "#2D2008" },
    { label: "Contactados",    value: String(contacted),         icon: <PhoneCall className="w-5 h-5" />,   color: "#818CF8", bg: "#161030" },
    { label: "Cerrados",       value: String(closed),            icon: <CheckCircle2 className="w-5 h-5" />,color: "#34D399", bg: "#082019" },
    { label: "Cancelados",     value: String(cancelled),         icon: <XCircle className="w-5 h-5" />,     color: "#F87171", bg: "#200D0D" },
    { label: "Facturado",      value: formatPrice(revenue),      icon: <ShoppingBag className="w-5 h-5" />, color: "#22D3EE", bg: "#081C2D" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F1F5F9" }}>
          Pedidos
        </h1>
        <p style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>
          Gestión de pedidos recibidos desde el carrito
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="p-4 rounded-2xl" style={{ background: "#0F1A29", border: "1px solid #1E2A3A" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#F1F5F9" }}>
              {card.value}
            </p>
            <p style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <PedidosClient orders={orders} />
    </div>
  );
}
