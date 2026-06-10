"use client";

import Image from "next/image";
import { Target, Heart, Award, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Nuestra misión",
    body: "Conectar personas con la tecnología para inspirar comunicación, creatividad y futuro.",
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: Heart,
    title: "Nuestros valores",
    body: "Transparencia, calidad y compromiso genuino con cada cliente que confía en nosotros.",
    accent: "#8B5CF6",
    glow: "rgba(139,92,246,0.15)",
  },
];

export default function AboutSection() {
  return (
    <section
      id="quienes-somos"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0A0F1E 0%, #0F1629 50%, #0D1426 100%)",
      }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(59,130,246,0.6) 30%, rgba(139,92,246,0.6) 70%, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: images composition ── */}
          <div className="relative">
            {/* Main image */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.06)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=700&q=75&auto=format&fit=crop"
                alt="Equipo Mobile World atendiendo clientes"
                width={600}
                height={440}
                className="object-cover w-full h-[360px] lg:h-[440px]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(10,15,30,0.55) 0%, transparent 60%)" }}
              />
            </div>

            {/* Secondary image (inset) */}
            <div
              className="absolute -bottom-6 -right-4 hidden sm:block rounded-2xl overflow-hidden w-40 h-32"
              style={{
                border: "2px solid rgba(255,255,255,0.10)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.40), 0 0 20px rgba(59,130,246,0.15)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&q=70&auto=format&fit=crop"
                alt="Accesorios tecnológicos"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating badge */}
            <div
              className="absolute top-4 -left-4 hidden sm:flex flex-col gap-0.5 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(15,22,41,0.90)",
                border: "1px solid rgba(59,130,246,0.25)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 16px rgba(59,130,246,0.12)",
              }}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: "#3B82F6" }} />
                <span
                  style={{
                    color: "#F1F5F9",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  Calidad garantizada
                </span>
              </div>
              <span style={{ color: "#64748B", fontSize: "12px" }}>Productos seleccionados</span>
            </div>
          </div>

          {/* ── Right: copy ── */}
          <div className="space-y-8">
            <div>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5"
                style={{
                  background: "rgba(59,130,246,0.12)",
                  color: "#60A5FA",
                  border: "1px solid rgba(59,130,246,0.25)",
                }}
              >
                Quiénes somos
              </span>

              <h2
                className="text-3xl sm:text-4xl font-bold leading-tight mt-4 mb-5"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.03em",
                  color: "#F1F5F9",
                }}
              >
                Conectamos personas
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #60A5FA 0%, #A78BFA 60%, #22D3EE 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  con la tecnología
                </span>
              </h2>

              <p style={{ color: "#94A3B8", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "480px" }}>
                Somos una empresa dedicada a la venta mayorista y minorista de
                celulares y accesorios tecnológicos, comprometidos con ofrecer
                productos de calidad, atención personalizada y una excelente
                experiencia de compra en cada interacción.
              </p>
            </div>

            {/* Values cards */}
            <div className="space-y-4">
              {values.map(({ icon: Icon, title, body, accent, glow }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.06)";
                    el.style.borderColor = `${accent}40`;
                    el.style.boxShadow = `0 8px 32px ${glow}`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <div>
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#E2E8F0" }}
                    >
                      {title}
                    </h3>
                    <p style={{ color: "#64748B", fontSize: "0.875rem", lineHeight: 1.65 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom stat row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { icon: Users, label: "Clientes atendidos", value: "Cientos", accent: "#3B82F6" },
                { icon: Award, label: "Calidad garantizada", value: "Siempre", accent: "#8B5CF6" },
              ].map(({ icon: Icon, label, value, accent }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: accent }} />
                  <p
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F1F5F9" }}
                  >
                    {value}
                  </p>
                  <p style={{ color: "#64748B", fontSize: "12px", marginTop: "2px" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
