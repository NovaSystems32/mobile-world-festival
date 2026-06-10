"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ShoppingCart, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cartStore";
import { formatPrice, whatsappLink } from "@/lib/utils";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, total, isOpen, closeCart } = useCart();

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  // Bloquear scroll cuando está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function buildWhatsAppMessage() {
    const lines = items.map(
      (i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`
    );
    const msg = [
      "Hola! Quiero consultar por los siguientes productos:",
      "",
      ...lines,
      "",
      `*Total: ${formatPrice(total())}*`,
    ].join("\n");
    return whatsappLink(msg);
  }

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.60)" }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          width: "min(420px, 100vw)",
          background: "#0B1120",
          borderLeft: "1px solid #1E2A3A",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.50)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1E2A3A" }}>
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5" style={{ color: "#3B82F6" }} />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "17px", color: "#F1F5F9" }}>
              Tu carrito
            </h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#3B82F6", color: "white" }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "#64748B", background: "#111D2E" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#111D2E" }}>
                <ShoppingBag className="w-8 h-8" style={{ color: "#334155" }} />
              </div>
              <div className="text-center">
                <p style={{ color: "#64748B", fontWeight: 600, fontSize: "15px" }}>El carrito está vacío</p>
                <p style={{ color: "#334155", fontSize: "13px", marginTop: "4px" }}>Agregá productos para consultar</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 rounded-2xl"
                style={{ background: "#111D2E", border: "1px solid #1E2A3A" }}
              >
                {/* Imagen */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#0F1A29" }}>
                  {item.product.main_image ? (
                    <Image
                      src={item.product.main_image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6" style={{ color: "#334155" }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#F1F5F9" }}>
                    {item.product.name}
                  </p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: "#3B82F6" }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "#0F1A29", border: "1px solid #1E2A3A", color: "#64748B" }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center" style={{ color: "#F1F5F9" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "#0F1A29", border: "1px solid #1E2A3A", color: "#64748B" }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "#0F1A29", border: "1px solid #1E2A3A", color: "#475569" }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 space-y-3" style={{ borderTop: "1px solid #1E2A3A" }}>
            {/* Total */}
            <div className="flex items-center justify-between px-1">
              <span style={{ color: "#64748B", fontSize: "14px" }}>Total estimado</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#F1F5F9" }}>
                {formatPrice(total())}
              </span>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeCart}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #16A34A, #15803D)",
                boxShadow: "0 4px 20px rgba(22,163,74,0.30)",
                fontSize: "15px",
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Consultar por WhatsApp
            </a>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full py-2 text-xs font-medium transition-all"
              style={{ color: "#475569" }}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
