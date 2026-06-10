"use client";

import { useState } from "react";
import { markMessageRead, markAllRead, deleteMessage } from "@/lib/actions/contact";
import { MessageSquare, Phone, Mail, Trash2, CheckCheck, Check, ChevronDown } from "lucide-react";

type Message = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function ContactosClient({ messages }: { messages: Message[] }) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  async function handleRead(id: string) {
    setLoadingId(id);
    await markMessageRead(id);
    setLoadingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    setLoadingId(id);
    await deleteMessage(id);
    setLoadingId(null);
  }

  async function handleMarkAll() {
    await markAllRead();
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Filter tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                filter === f
                  ? { background: "rgba(59,130,246,0.20)", color: "#60A5FA" }
                  : { color: "#64748B" }
              }
            >
              {f === "all" ? `Todos (${messages.length})` : f === "unread" ? `Sin leer (${unreadCount})` : "Leídos"}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#22D3EE] transition-all"
            style={{ background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.20)" }}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Marcar todos como leídos
          </button>
        )}
      </div>

      {/* Messages list */}
      {filtered.length === 0 ? (
        <div
          className="py-16 text-center rounded-2xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <MessageSquare className="w-10 h-10 text-[#334155] mx-auto mb-3" />
          <p className="text-[#475569] text-sm">No hay mensajes en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: msg.is_read ? "rgba(255,255,255,0.02)" : "rgba(34,211,238,0.04)",
                border: msg.is_read ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(34,211,238,0.18)",
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                  style={{
                    background: msg.is_read ? "rgba(100,116,139,0.15)" : "rgba(34,211,238,0.15)",
                    color: msg.is_read ? "#64748B" : "#22D3EE",
                  }}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">{msg.name}</span>
                    {!msg.is_read && (
                      <span
                        className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE" }}
                      >
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="text-[#64748B] text-xs truncate mt-0.5">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[#334155] text-[11px] hidden sm:block">
                    {new Date(msg.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit", month: "short", year: "2-digit"
                    })}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#475569] transition-transform ${expanded === msg.id ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === msg.id && (
                <div
                  className="px-4 pb-4 pt-1 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex flex-wrap gap-3 mb-3">
                    {msg.phone && (
                      <a
                        href={`https://wa.me/${msg.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.20)" }}
                      >
                        <Phone className="w-3 h-3" />
                        {msg.phone}
                      </a>
                    )}
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.20)" }}
                      >
                        <Mail className="w-3 h-3" />
                        {msg.email}
                      </a>
                    )}
                  </div>

                  <p
                    className="text-sm leading-relaxed p-3 rounded-xl mb-3"
                    style={{ color: "#CBD5E1", background: "rgba(255,255,255,0.03)" }}
                  >
                    {msg.message}
                  </p>

                  <div className="flex items-center gap-2">
                    {!msg.is_read && (
                      <button
                        onClick={() => handleRead(msg.id)}
                        disabled={loadingId === msg.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                        style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.20)" }}
                      >
                        <Check className="w-3 h-3" />
                        Marcar como leído
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={loadingId === msg.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                      style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.20)" }}
                    >
                      <Trash2 className="w-3 h-3" />
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
