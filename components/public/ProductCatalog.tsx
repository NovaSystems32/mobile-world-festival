"use client";

import { useState } from "react";
import { Product, Category } from "@/types";
import ProductCard from "./ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductCatalog({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch]                 = useState("");

  const filtered = products.filter((p) => {
    const matchCat =
      activeCategory === "all"       ? true :
      activeCategory === "ofertas"   ? p.is_featured :
      activeCategory === "mayoristas"? p.is_wholesale :
      p.category?.slug === activeCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      !!p.sku?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const tabs = [
    { slug: "all",       name: "Todos" },
    ...categories,
    { slug: "ofertas",   name: "Ofertas" },
    { slug: "mayoristas",name: "Mayoristas" },
  ];

  return (
    <section id="productos" className="py-20 lg:py-28 section-dark relative">
      <div className="section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="badge badge-blue mb-4">Catálogo</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Nuestros <span className="gradient-text">productos</span>
          </h2>
          <p className="text-[#64748B] text-lg">
            Stock actualizado en tiempo real. Todos los precios incluyen IVA.
          </p>
        </div>

        {/* Toolbar: filters + search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveCategory(tab.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === tab.slug
                    ? "bg-[#1D4ED8] text-white shadow-[0_4px_16px_rgba(29,78,216,0.40)]"
                    : "bg-white/5 border border-white/10 text-[#64748B] hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg text-sm w-full sm:w-64"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <SlidersHorizontal className="w-7 h-7 text-[#475569]" />
            </div>
            <p className="text-[#64748B] font-medium">
              No encontramos productos con ese filtro.
            </p>
            <button
              onClick={() => { setActiveCategory("all"); setSearch(""); }}
              className="text-[#60A5FA] text-sm font-semibold hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Results count */}
        {filtered.length > 0 && (
          <p className="text-center text-sm text-[#94A3B8] mt-10">
            Mostrando {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </section>
  );
}
