import { getContactMessages, getUnreadCount } from "@/lib/actions/contact";
import ContactosClient from "@/components/admin/ContactosClient";
import { MessageSquare, Inbox } from "lucide-react";

export default async function ContactosPage() {
  const [messages, unread] = await Promise.all([
    getContactMessages(),
    getUnreadCount(),
  ]);

  const total = messages.length;
  const read = total - unread;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-bold text-2xl text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Mensajes de contacto
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Consultas recibidas desde el formulario del sitio.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: total, color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
          { label: "Sin leer", value: unread, color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
          { label: "Leídos", value: read, color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <span className="font-bold text-lg" style={{ color }}>{value}</span>
            </div>
            <p className="text-[#64748B] text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Client inbox */}
      <ContactosClient messages={messages as Parameters<typeof ContactosClient>[0]["messages"]} />
    </div>
  );
}
