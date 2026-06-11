"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShoppingCart, MessageCircle, Check,
  Package, BadgeCheck, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getStockStatus, whatsappLink } from "@/lib/utils";
import { useCart } from "@/store/cartStore";

export default function ProductDetail({ product }: { product: Product }) {
  const allImages = [
    ...(product.main_image ? [product.main_image] : []),
    ...(product.images || []).filter((img) => img !== product.main_image),
  ];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();
  const status = getStockStatus(product.stock, product.low_stock_alert);

  const dotColor = { green: "#22C55E", yellow: "#D97706", red: "#DC2626" }[status.color];
  const stockBg  = { green: "#082019", yellow: "#2D2008", red: "#200D0D" }[status.color];

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 600);
  }

  const prevImg = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % allImages.length);

  return (
    <div
      className="min-h-screen pt-24 pb-16"
      style={{ background: "linear-gradient(160deg, #0A0F1E 0%, #0D1426 60%, #0A0F1E 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <Link
          href="/#productos"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors"
          style={{ color: "#64748B" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#94A3B8"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── GALERÍA ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "1",
                background: "linear-gradient(135deg, #0F1A29, #111D2E)",
                border: "1px solid #1E2A3A",
              }}
            >
              {allImages.length > 0 ? (
                <Image
                  src={allImages[activeImg]}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-opacity duration-300"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-20 h-20" style={{ color: "#1E2A3A" }} />
                </div>
              )}

              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: "rgba(11,17,32,0.80)", border: "1px solid #1E2A3A", color: "#94A3B8" }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: "rgba(11,17,32,0.80)", border: "1px solid #1E2A3A", color: "#94A3B8" }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className="rounded-full transition-all"
                        style={{
                          width: i === activeImg ? "20px" : "6px",
                          height: "6px",
                          background: i === activeImg ? "#3B82F6" : "rgba(255,255,255,0.25)",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.is_featured && (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: "#0D1E36", border: "1px solid #3B82F6", color: "#60A5FA" }}>
                    Destacado
                  </span>
                )}
                {product.is_wholesale && (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: "#2D2008", border: "1px solid #D97706", color: "#FBBF24" }}>
                    Mayorista
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all"
                    style={{
                      border: `2px solid ${i === activeImg ? "#3B82F6" : "#1E2A3A"}`,
                      background: "#0F1A29",
                    }}
                  >
                    <Image src={img} alt={`Foto ${i + 1}`} fill className="object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFO ── */}
          <div className="flex flex-col gap-6">

            {/* Category + name */}
            <div>
              {product.category && (
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#3B82F6" }}>
                  {product.category.name}
                </p>
              )}
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4vw, 34px)", color: "#F1F5F9", lineHeight: 1.2 }}>
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-xs mt-2" style={{ color: "#475569" }}>SKU: {product.sku}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5vw, 40px)", color: "#F1F5F9", lineHeight: 1 }}>
                {formatPrice(product.price)}
              </span>
              {product.wholesale_price && (
                <div className="pb-1">
                  <p className="text-xs" style={{ color: "#64748B" }}>Precio mayorista</p>
                  <p className="font-bold text-sm" style={{ color: "#FBBF24" }}>{formatPrice(product.wholesale_price)}</p>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit" style={{ background: stockBg, border: `1px solid ${dotColor}40` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
              <span className="text-sm font-semibold" style={{ color: dotColor }}>
                {status.label}
                {product.stock > 0 && ` · ${product.stock} unidades`}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="p-4 rounded-2xl space-y-2" style={{ background: "#0F1A29", border: "1px solid #1E2A3A" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#475569" }}>Descripción</p>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{product.description}</p>
              </div>
            )}

            {/* Condition */}
            {product.condition !== "new" && (
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" style={{ color: "#60A5FA" }} />
                <span className="text-sm" style={{ color: "#64748B" }}>
                  {product.condition === "used" ? "Usado seleccionado" : "Reacondicionado"}
                </span>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#475569" }}>Cantidad</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid #1E2A3A" }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-lg font-bold transition-colors"
                    style={{ background: "#0F1A29", color: "#64748B" }}
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-white" style={{ background: "#111D2E" }}>{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-lg font-bold transition-colors"
                    style={{ background: "#0F1A29", color: "#64748B" }}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-bold" style={{ color: "#60A5FA" }}>
                  = {formatPrice(product.price * qty)}
                </span>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: added ? "linear-gradient(135deg, #16A34A, #15803D)" : "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  boxShadow: added ? "0 4px 20px rgba(22,163,74,0.35)" : "0 4px 20px rgba(59,130,246,0.35)",
                }}
              >
                {added ? <><Check className="w-5 h-5" />¡Agregado!</> : <><ShoppingCart className="w-5 h-5" />Agregar al carrito</>}
              </button>

              <a
                href={whatsappLink(`Hola, me interesa el producto: ${product.name}${product.sku ? ` (SKU: ${product.sku})` : ""}. ¿Tienen stock disponible?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-semibold text-white text-sm transition-all"
                style={{ background: "#082019", border: "1px solid rgba(34,197,94,0.30)", color: "#34D399" }}
              >
                <MessageCircle className="w-5 h-5" />
                Consultar por WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
