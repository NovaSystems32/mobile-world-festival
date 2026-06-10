"use client";

import Image from "next/image";
import { MessageCircle, ArrowRight, Building2, Package, Globe2 } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

const profiles = [
  { icon: Building2, label: "Comercios y locales" },
  { icon: Package,   label: "Distribuidores"      },
  { icon: Globe2,    label: "Revendedores online"  },
];

const stats = [
  { value: "30%", label: "Descuento mayorista" },
  { value: "500+", label: "Clientes activos"   },
  { value: "24h",  label: "Respuesta rápida"   },
];

export default function WholesaleSection() {
  return (
    <section id="mayoristas" className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#FFFFFF" }}>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, transparent, #1D4ED8 30%, #7C3AED 70%, transparent)" }} />

      {/* Subtle bg shape */}
      <div className="absolute top-0 right-0 w-[600px] h-full pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(ellipse 80% 80% at 100% 50%, #1D4ED8 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: copy */}
          <div className="space-y-8">

            {/* Eyebrow */}
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest"
              style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}
            >
              Programa mayorista
            </span>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0F172A", letterSpacing: "-0.03em" }}
            >
              Precios especiales
              <br />
              para{" "}
              <span style={{
                background: "linear-gradient(90deg, #1D4ED8, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                revendedores
              </span>
            </h2>

            <p style={{ color: "#64748B", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: "480px" }}>
              Trabajamos con revendedores, comercios y distribuidores de todo
              el país. Consultanos por listas de precios actualizadas y stock
              disponible. Precios competitivos según volumen de compra.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="text-3xl font-bold"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: "linear-gradient(90deg, #1D4ED8, #7C3AED)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ color: "#64748B", fontSize: "0.8rem", fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Profile badges */}
            <div className="flex flex-wrap gap-3">
              {profiles.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all"
                  style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#334155" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#1D4ED8" }} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={whatsappLink("Hola, quisiera información sobre precios mayoristas y listas de precios actualizadas.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #4F46E5)",
                boxShadow: "0 4px 20px rgba(29,78,216,0.30)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(29,78,216,0.45)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(29,78,216,0.30)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Solicitar lista mayorista
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Right: image */}
          <div className="relative hidden lg:block">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: "0 24px 60px rgba(15,23,42,0.14)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=700&q=80&auto=format&fit=crop"
                alt="Distribución mayorista de celulares"
                width={600}
                height={420}
                className="object-cover w-full h-[400px]"
              />
              {/* Light gradient at bottom */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(255,255,255,0.15), transparent 60%)" }} />
            </div>

            {/* Floating stat card */}
            <div
              className="absolute -bottom-6 -left-8 px-6 py-4 rounded-2xl"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>
                Precio mayorista
              </p>
              <p
                className="font-bold text-xl"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "linear-gradient(90deg, #1D4ED8, #7C3AED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Hasta 30% OFF
              </p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: "#16A34A" }}>
                vs. precio minorista
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
