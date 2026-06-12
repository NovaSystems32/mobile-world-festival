"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X, ShoppingCart, MessageCircle, Check,
  Package, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getStockStatus, whatsappLink } from "@/lib/utils";
import { useCart } from "@/store/cartStore";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const allImages = [
    ...(product.main_image ? [product.main_image] : []),
    ...(product.images || []).filter((img) => img !== product.main_image),
  ];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [priceType, setPriceType] = useState<"retail" | "wholesale">("retail");
  const { addItem, openCart } = useCart();
  const status = getStockStatus(product.stock, product.low_stock_alert);

  const dotColor = { green: "#22C55E", yellow: "#D97706", red: "#DC2626" }[status.color];
  const stockBg  = { green: "#082019", yellow: "#2D2008", red: "#200D0D" }[status.color];

  const activePrice = priceType === "wholesale" && product.wholesale_price
    ? product.wholesale_price
    : product.price;

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleAdd() {
    const productWithPrice = { ...product, price: activePrice };
    for (let i = 0; i < qty; i++) addItem(productWithPrice);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); openCart(); }, 700);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl"
          style={{ background: "#0B1120", border: "1px solid #1E2A3A", boxShadow: "0 24px 80px rgba(0,0,0,0.70)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background: "#111D2E", border: "1px solid #1E2A3A", color: "#64748B" }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">

            {/* ── GALERÍA ── */}
            <div className="p-5 space-y-3">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ aspectRatio: "1", background: "#0F1A29", border: "1px solid #1E2A3A" }}
              >
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[activeImg]}
                    alt={product.name}
                    fill
                    className="object-contain p-6"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16" style={{ color: "#1E2A3A" }} />
                  </div>
                )}

                {allImages.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(11,17,32,0.85)", border: "1px solid #1E2A3A", color: "#94A3B8" }}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setActiveImg((i) => (i + 1) % allImages.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(11,17,32,0.85)", border: "1px solid #1E2A3A", color: "#94A3B8" }}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button key={i} onClick={() => setActiveImg(i)}
                          className="rounded-full transition-all"
                          style={{ width: i === activeImg ? "18px" : "6px", height: "6px", background: i === activeImg ? "#3B82F6" : "rgba(255,255,255,0.25)" }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.is_featured && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: "#0D1E36", border: "1px solid #3B82F6", color: "#60A5FA" }}>Destacado</span>
                  )}
                  {product.is_wholesale && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: "#2D2008", border: "1px solid #D97706", color: "#FBBF24" }}>Mayorista</span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all"
                      style={{ border: `2px solid ${i === activeImg ? "#3B82F6" : "#1E2A3A"}`, background: "#0F1A29" }}>
                      <Image src={img} alt={`Foto ${i + 1}`} fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── INFO ── */}
            <div className="p-5 flex flex-col gap-4">
              {/* Category + name */}
              <div>
                {product.category && (
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#3B82F6" }}>
                    {product.category.name}
                  </p>
                )}
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px", color: "#F1F5F9", lineHeight: 1.3 }}>
                  {product.name}
                </h2>
                {product.sku && <p className="text-xs mt-1" style={{ color: "#475569" }}>SKU: {product.sku}</p>}
              </div>

              {/* Selector minorista / mayorista */}
              {product.wholesale_price && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setPriceType("retail")}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: priceType === "retail" ? "#0D1E36" : "#0F1A29",
                      border: `1px solid ${priceType === "retail" ? "#3B82F6" : "#1E2A3A"}`,
                      color: priceType === "retail" ? "#60A5FA" : "#475569",
                    }}
                  >
                    Minorista
                  </button>
                  <button
                    onClick={() => setPriceType("wholesale")}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: priceType === "wholesale" ? "#2D2008" : "#0F1A29",
                      border: `1px solid ${priceType === "wholesale" ? "#D97706" : "#1E2A3A"}`,
                      color: priceType === "wholesale" ? "#FBBF24" : "#475569",
                    }}
                  >
                    Mayorista
                  </button>
                </div>
              )}

              {/* Price */}
              <div className="flex items-end gap-3">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "30px", color: "#F1F5F9", lineHeight: 1 }}>
                  {formatPrice(activePrice)}
                </span>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit" style={{ background: stockBg, border: `1px solid ${dotColor}40` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: dotColor, boxShadow: `0 0 5px ${dotColor}` }} />
                <span className="text-xs font-semibold" style={{ color: dotColor }}>
                  {status.label}{product.stock > 0 ? ` · ${product.stock} unidades` : ""}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="p-3 rounded-2xl" style={{ background: "#0F1A29", border: "1px solid #1E2A3A" }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>Descripción</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{product.description}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#475569" }}>Cantidad</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #1E2A3A" }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold"
                      style={{ background: "#0F1A29", color: "#64748B" }}>−</button>
                    <span className="w-10 text-center font-bold text-white text-sm" style={{ background: "#111D2E" }}>{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold"
                      style={{ background: "#0F1A29", color: "#64748B" }}>+</button>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "#60A5FA" }}>
                    = {formatPrice(activePrice * qty)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 mt-auto">
                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: added ? "linear-gradient(135deg,#16A34A,#15803D)" : "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                    boxShadow: added ? "0 4px 16px rgba(22,163,74,0.35)" : "0 4px 16px rgba(59,130,246,0.30)",
                  }}
                >
                  {added ? <><Check className="w-4 h-4" />¡Agregado!</> : <><ShoppingCart className="w-4 h-4" />Agregar al carrito</>}
                </button>

                <a
                  href={whatsappLink(`Hola, me interesa: ${product.name}${product.sku ? ` (SKU: ${product.sku})` : ""}. ¿Tienen stock?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm transition-all"
                  style={{ background: "#082019", border: "1px solid rgba(34,197,94,0.30)", color: "#34D399" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
