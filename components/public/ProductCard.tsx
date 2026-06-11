"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getStockStatus, whatsappLink } from "@/lib/utils";
import { useCart } from "@/store/cartStore";
import ProductModal from "@/components/public/ProductModal";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const status = getStockStatus(product.stock, product.low_stock_alert);

  const stockClass = { green: "stock-ok", yellow: "stock-low", red: "stock-empty" }[status.color];
  const dotColor   = { green: "bg-[#16A34A]", yellow: "bg-[#D97706]", red: "bg-[#DC2626]" }[status.color];

  return (
    <>
      <article className="card group flex flex-col overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>

        {/* Image */}
        <div className="relative bg-[#0F1629] overflow-hidden" style={{ aspectRatio: "1" }}>
          {product.main_image ? (
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=70&auto=format&fit=crop"
                alt={product.name}
                fill
                className="object-cover opacity-20"
              />
              <span className="relative text-[#1D4ED8] font-display font-bold text-lg z-10 px-4 text-center">
                {product.name}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_featured && (
              <span className="badge badge-blue text-[10px] px-2.5 py-1">Destacado</span>
            )}
            {product.is_wholesale && (
              <span className="badge badge-amber text-[10px] px-2.5 py-1">Mayorista</span>
            )}
            {product.condition === "used" && (
              <span className="badge text-[10px] px-2.5 py-1 bg-[#F1F5F9] text-[#475569]">
                Usado sel.
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {product.category && (
            <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-widest">
              {product.category.name}
            </span>
          )}

          <h3 className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-[#60A5FA] transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[#64748B] text-xs leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-end justify-between mt-auto gap-2">
            <div>
              <p className="font-display font-bold text-white text-xl leading-none">
                {formatPrice(product.price)}
              </p>
              {product.wholesale_price && (
                <p className="text-[#64748B] text-xs mt-0.5">
                  May: {formatPrice(product.wholesale_price)}
                </p>
              )}
            </div>
            <span className={`badge ${stockClass} flex items-center gap-1.5 text-[10px] flex-shrink-0`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {status.label}
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <a
              href={whatsappLink(`Hola, me interesa el producto: ${product.name}${product.sku ? ` (SKU: ${product.sku})` : ""}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-[#94A3B8] hover:border-[#22C55E]/50 hover:text-[#22C55E] text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Consultar
            </a>
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Agregar
            </button>
          </div>
        </div>
      </article>

      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
