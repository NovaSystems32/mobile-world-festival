"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X, ShoppingCart, Trash2, Plus, Minus, MessageCircle,
  ShoppingBag, ArrowRight, ArrowLeft, User, Phone, Mail,
  CheckCircle2, Loader2,
} from "lucide-react";
import { useCart } from "@/store/cartStore";
import { formatPrice, whatsappLink } from "@/lib/utils";
import { createOrder } from "@/lib/actions/orders";

type Step = "cart" | "form" | "success";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, total, isOpen, closeCart } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // Reset step al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setStep("cart"); setError(""); }, 300);
    }
  }, [isOpen]);

  // Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Block scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderItems = items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        product_image: i.product.main_image,
        price: i.product.price,
        quantity: i.quantity,
      }));

      await createOrder({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || undefined,
        items: orderItems,
        total: total(),
      });

      // Armar link de WhatsApp para el negocio
      const lines = items.map(
        (i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`
      );
      const msg = [
        `🛒 *Nuevo pedido de ${form.name}*`,
        `📱 Teléfono: ${form.phone}`,
        form.email ? `✉️ Email: ${form.email}` : "",
        "",
        "*Productos:*",
        ...lines,
        "",
        `*Total: ${formatPrice(total())}*`,
        "",
        "_Pedido registrado en el panel de admin_",
      ].filter(Boolean).join("\n");

      setWhatsappUrl(whatsappLink(msg));
      setStep("success");
      clearCart();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar el pedido.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#334155] focus:outline-none transition-all";
  const inputStyle = { background: "#111D2E", border: "1px solid #1E2A3A" };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          width: "min(440px, 100vw)",
          background: "#0B1120",
          borderLeft: "1px solid #1E2A3A",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.55)",
        }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid #1E2A3A" }}>
          <div className="flex items-center gap-2.5">
            {step === "form" && (
              <button onClick={() => setStep("cart")} className="w-7 h-7 rounded-lg flex items-center justify-center mr-1" style={{ background: "#111D2E", color: "#64748B" }}>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <ShoppingCart className="w-5 h-5" style={{ color: "#3B82F6" }} />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "17px", color: "#F1F5F9" }}>
              {step === "cart" ? "Tu carrito" : step === "form" ? "Tus datos" : "¡Pedido enviado!"}
            </h2>
            {step === "cart" && totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#3B82F6", color: "white" }}>
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "#64748B", background: "#111D2E" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── STEP: CART ── */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#111D2E" }}>
                    <ShoppingBag className="w-8 h-8" style={{ color: "#334155" }} />
                  </div>
                  <div className="text-center">
                    <p style={{ color: "#64748B", fontWeight: 600, fontSize: "15px" }}>El carrito está vacío</p>
                    <p style={{ color: "#334155", fontSize: "13px", marginTop: "4px" }}>Agregá productos para hacer tu pedido</p>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 rounded-2xl" style={{ background: "#111D2E", border: "1px solid #1E2A3A" }}>
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#0F1A29" }}>
                      {item.product.main_image ? (
                        <Image src={item.product.main_image} alt={item.product.name} width={64} height={64} className="w-full h-full object-contain p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6" style={{ color: "#334155" }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#F1F5F9" }}>{item.product.name}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: "#60A5FA" }}>
                        {formatPrice(item.product.price)} c/u
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0F1A29", border: "1px solid #1E2A3A", color: "#64748B" }}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center" style={{ color: "#F1F5F9" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0F1A29", border: "1px solid #1E2A3A", color: "#64748B" }}>
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="ml-auto text-xs font-bold" style={{ color: "#A78BFA" }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button onClick={() => removeItem(item.product.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0F1A29", border: "1px solid #1E2A3A", color: "#475569" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-4 py-4 space-y-3 flex-shrink-0" style={{ borderTop: "1px solid #1E2A3A" }}>
                <div className="flex items-center justify-between px-1">
                  <span style={{ color: "#64748B", fontSize: "14px" }}>{totalItems} producto{totalItems !== 1 ? "s" : ""}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "22px", color: "#F1F5F9" }}>
                    {formatPrice(total())}
                  </span>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 4px 20px rgba(59,130,246,0.30)", fontSize: "15px" }}
                >
                  Hacer pedido
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={clearCart} className="w-full py-2 text-xs font-medium" style={{ color: "#475569" }}>
                  Vaciar carrito
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP: FORM ── */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

              {/* Resumen mini */}
              <div className="p-3 rounded-xl space-y-1" style={{ background: "#111D2E", border: "1px solid #1E2A3A" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>Tu pedido</p>
                {items.map((i) => (
                  <div key={i.product.id} className="flex justify-between text-xs">
                    <span style={{ color: "#94A3B8" }}>{i.product.name} x{i.quantity}</span>
                    <span style={{ color: "#60A5FA", fontWeight: 600 }}>{formatPrice(i.product.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1.5" style={{ borderTop: "1px solid #1E2A3A" }}>
                  <span className="text-xs font-bold" style={{ color: "#94A3B8" }}>Total</span>
                  <span className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{formatPrice(total())}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#F1F5F9" }}>Tus datos de contacto</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Un asesor te va a contactar para cerrar el trato.</p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Nombre completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Juan García"
                    required
                    className={inputClass + " pl-10"}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.50)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1E2A3A")}
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Teléfono / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+54 9 351 000 0000"
                    required
                    className={inputClass + " pl-10"}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.50)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1E2A3A")}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Email <span style={{ color: "#475569", fontWeight: 400 }}>(opcional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="juan@email.com"
                    className={inputClass + " pl-10"}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.50)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#1E2A3A")}
                  />
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}>
                  {error}
                </div>
              )}
            </div>

            <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: "1px solid #1E2A3A" }}>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 4px 20px rgba(59,130,246,0.30)", fontSize: "15px" }}
              >
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" />Enviando pedido...</>
                  : <><CheckCircle2 className="w-5 h-5" />Confirmar pedido</>
                }
              </button>
            </div>
          </form>
        )}

        {/* ── STEP: SUCCESS ── */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.30)" }}>
              <CheckCircle2 className="w-10 h-10" style={{ color: "#22C55E" }} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#F1F5F9", marginBottom: "8px" }}>
                ¡Pedido recibido!
              </h3>
              <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 1.6 }}>
                Tu pedido fue registrado. Un asesor de <strong style={{ color: "#94A3B8" }}>Mobile World Festival</strong> te va a contactar a la brevedad para cerrar el trato.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", boxShadow: "0 4px 20px rgba(22,163,74,0.30)", fontSize: "14px" }}
            >
              <MessageCircle className="w-5 h-5" />
              También podés escribirnos por WhatsApp
            </a>

            <button
              onClick={closeCart}
              className="text-sm font-medium"
              style={{ color: "#475569" }}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
