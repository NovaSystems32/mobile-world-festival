"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { paises } from "@/lib/directorio-data";

export default function DirectorioHome() {
  const [search, setSearch] = useState("");
  const filtered = paises.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(160deg, #050814 0%, #0d1229 40%, #0a0d1f 70%, #050814 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <div className="relative px-5 pt-14 pb-6 flex flex-col items-center text-center">
        <div className="mb-4 relative">
          <div className="absolute inset-0 rounded-3xl blur-xl opacity-40" style={{ background: "linear-gradient(135deg, #3B82F6, #8b5cf6)", transform: "scale(1.2)" }} />
          <Image
            src="/logo.png"
            alt="Mobile World Festival"
            width={76}
            height={76}
            className="relative rounded-3xl shadow-2xl"
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Directorio</h1>
        <p className="mt-1.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
          Empresas tecnológicas de Latinoamérica
        </p>

        {/* Search bar */}
        <div className="mt-5 w-full max-w-sm relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white outline-none transition-all duration-200 placeholder-white/25"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            }}
          />
        </div>
      </div>

      {/* Countries Grid */}
      <div className="relative px-4 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>No se encontró ningún país</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {filtered.map((pais) => (
              <Link key={pais.slug} href={`/directorio/${pais.slug}`}>
                <div className="flex flex-col items-center gap-2 group">
                  {/* Flag card */}
                  <div
                    className="w-full aspect-square rounded-[24%] overflow-hidden relative transition-all duration-200 group-hover:scale-105 group-active:scale-95"
                    style={{
                      boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Image
                      src={`https://flagcdn.com/w160/${pais.codigo}.png`}
                      alt={pais.nombre}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* Gloss overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-white text-[11px] font-semibold leading-tight block">{pais.nombre}</span>
                    <span className="text-[9px] font-medium block mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Ver empresas</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative text-center pb-8 px-4">
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Mobile World Festival © 2025</p>
      </div>
    </div>
  );
}
