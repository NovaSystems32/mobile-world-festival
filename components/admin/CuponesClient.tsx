"use client";

import { useState } from "react";
import { createCoupon, updateCoupon, toggleCoupon, deleteCoupon } from "@/lib/actions/coupons";
import { Coupon } from "@/types";
import { Plus, Percent, DollarSign, Trash2, Edit2, X, Save, Tag, ToggleLeft, ToggleRight } from "lucide-react";

type FormState = {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  min_purchase: string;
  max_uses: string;
  expires_at: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  min_purchase: "",
  max_uses: "",
  expires_at: "",
  is_active: true,
};

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function CuponesClient({ coupons: initial }: { coupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#334155] focus:outline-none transition-colors";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
  };

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(c: Coupon) {
    setEditing(c);
    setForm({
      code: c.code,
      description: c.description || "",
      discount_type: c.discount_type,
      discount_value: c.discount_value.toString(),
      min_purchase: c.min_purchase?.toString() || "",
      max_uses: c.max_uses?.toString() || "",
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : "",
      is_active: c.is_active,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || undefined,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_purchase: form.min_purchase ? parseFloat(form.min_purchase) : undefined,
        max_uses: form.max_uses ? parseInt(form.max_uses) : undefined,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : undefined,
        is_active: form.is_active,
      };
      if (editing) {
        await updateCoupon(editing.id, payload);
      } else {
        await createCoupon(payload);
      }
      setShowForm(false);
      window.location.reload();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setLoading(false);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleCoupon(id, !current);
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c));
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`¿Eliminar el cupón "${code}"?`)) return;
    await deleteCoupon(id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Create button */}
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 4px 16px rgba(59,130,246,0.30)" }}
        >
          <Plus className="w-4 h-4" />
          Nuevo cupón
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-6 space-y-5"
            style={{ background: "#0F1629", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {editing ? "Editar cupón" : "Nuevo cupón"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.20)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Código del cupón *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="VERANO25"
                    required
                    className={inputClass}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, code: generateCode() })}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
                    style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.20)" }}
                  >
                    Generar
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descuento de verano"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Discount type + value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Tipo de descuento *
                  </label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}
                    className={inputClass}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Valor *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-sm">
                      {form.discount_type === "percentage" ? "%" : "$"}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.discount_value}
                      onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                      placeholder={form.discount_type === "percentage" ? "15" : "500"}
                      required
                      className={inputClass + " pl-7"}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Min purchase + max uses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Compra mínima ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.min_purchase}
                    onChange={(e) => setForm({ ...form, min_purchase: e.target.value })}
                    placeholder="0 (sin mínimo)"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Usos máximos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                    placeholder="Sin límite"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Expiry + active */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className={inputClass}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                  />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#3B82F6]"
                  />
                  <span className="text-[#94A3B8] text-sm">Cupón activo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60 transition-all"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                >
                  {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear cupón"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-[#64748B] text-sm font-medium transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <div
          className="py-16 text-center rounded-2xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Tag className="w-10 h-10 text-[#334155] mx-auto mb-3" />
          <p className="text-[#475569] text-sm mb-3">No hay cupones todavía.</p>
          <button
            onClick={openNew}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.20)" }}
          >
            Crear primer cupón
          </button>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Código", "Descuento", "Uso", "Condiciones", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ borderTop: "none" }}>
                {coupons.map((c) => {
                  const expired = c.expires_at && new Date(c.expires_at) < new Date();
                  const maxed = c.max_uses !== null && c.max_uses !== undefined && c.used_count >= c.max_uses;
                  return (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span
                          className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg"
                          style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA" }}
                        >
                          {c.code}
                        </span>
                        {c.description && (
                          <p className="text-[#475569] text-xs mt-1">{c.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{
                              background: c.discount_type === "percentage" ? "rgba(167,139,250,0.15)" : "rgba(34,197,94,0.15)",
                            }}
                          >
                            {c.discount_type === "percentage"
                              ? <Percent className="w-3 h-3" style={{ color: "#A78BFA" }} />
                              : <DollarSign className="w-3 h-3" style={{ color: "#22C55E" }} />
                            }
                          </div>
                          <span className="text-white font-bold text-sm">
                            {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value.toLocaleString("es-AR")}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-medium">{c.used_count}</span>
                        {c.max_uses && (
                          <span className="text-[#475569] text-xs"> / {c.max_uses}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 space-y-1">
                        {c.min_purchase && (
                          <p className="text-[#64748B] text-xs">Mín: ${c.min_purchase.toLocaleString("es-AR")}</p>
                        )}
                        {c.expires_at && (
                          <p className={`text-xs ${expired ? "text-[#EF4444]" : "text-[#64748B]"}`}>
                            Vence: {new Date(c.expires_at).toLocaleDateString("es-AR")}
                          </p>
                        )}
                        {!c.min_purchase && !c.expires_at && (
                          <p className="text-[#334155] text-xs">Sin restricciones</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(c.id, c.is_active)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                          style={
                            c.is_active && !expired && !maxed
                              ? { background: "rgba(34,197,94,0.12)", color: "#22C55E" }
                              : { background: "rgba(239,68,68,0.10)", color: "#EF4444" }
                          }
                        >
                          {c.is_active && !expired && !maxed
                            ? <><ToggleRight className="w-3.5 h-3.5" />Activo</>
                            : <><ToggleLeft className="w-3.5 h-3.5" />{expired ? "Vencido" : maxed ? "Agotado" : "Inactivo"}</>
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-white transition-all"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#EF4444] transition-all"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
