"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowRight, Package, BadgeCheck, Truck, Headphones, Tag } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

const benefits = [
  { icon: Package,    label: "Stock permanente"          },
  { icon: BadgeCheck, label: "Productos 100% originales" },
  { icon: Truck,      label: "Envíos a todo el país"      },
  { icon: Headphones, label: "Atención personalizada"    },
  { icon: Tag,        label: "Precios mayoristas"        },
];

export default function Hero() {
  const imageRef  = useRef<HTMLDivElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const card1Ref  = useRef<HTMLDivElement>(null);
  const card2Ref  = useRef<HTMLDivElement>(null);

  /* ── Parallax / tilt on mouse move ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5; // -0.5 … 0.5
      const y = (e.clientY - top)  / height - 0.5;

      if (imageRef.current) {
        imageRef.current.style.transform =
          `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(10px)`;
      }
      if (card1Ref.current) {
        card1Ref.current.style.transform =
          `translate(${x * -18}px, ${y * -12}px)`;
      }
      if (card2Ref.current) {
        card2Ref.current.style.transform =
          `translate(${x * 14}px, ${y * 10}px)`;
      }
    };

    const onLeave = () => {
      if (imageRef.current)
        imageRef.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
      if (card1Ref.current) card1Ref.current.style.transform = "translate(0,0)";
      if (card2Ref.current) card2Ref.current.style.transform = "translate(0,0)";
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #060B18 0%, #0D1530 45%, #100C2A 75%, #060B18 100%)",
      }}
    >
      {/* ── Ambient glows ── */}
      <div className="absolute top-[-220px] left-[-180px] w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(29,78,216,0.20) 0%, transparent 62%)", filter: "blur(2px)" }} />
      <div className="absolute bottom-[-240px] right-[-160px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 62%)", filter: "blur(2px)" }} />
      <div className="absolute top-[25%] right-[18%] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 68%)" }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-100 pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT — copy */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
              style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.22)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="text-[#67E8F9] text-[11px] font-semibold uppercase tracking-[0.14em]">
                Stock disponible hoy
              </span>
            </div>

            {/* Headline — Space Grotesk 800 */}
            <div>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(52px, 6.5vw, 88px)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.04em",
                  color: "#F8FAFC",
                  textShadow: "0 4px 40px rgba(0,0,0,0.40)",
                }}
              >
                Celulares al{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #00D4FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                  }}
                >
                  mejor precio
                </span>
                <br />
                para mayoristas
                <br />
                y minoristas
              </h1>
            </div>

            <p className="text-[#94A3B8] text-lg lg:text-xl leading-relaxed max-w-lg">
              Equipos nuevos, usados seleccionados y accesorios tecnológicos
              con atención personalizada y los mejores precios del mercado.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/#productos" className="btn-primary text-base">
                Ver productos
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappLink("Hola, quisiera consultar sobre sus productos.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-base"
              >
                <MessageCircle className="w-4 h-4" />
                Hablar por WhatsApp
              </a>
            </div>

            {/* Benefit pills */}
            <div className="flex flex-wrap lg:flex-nowrap gap-2 pt-1">
              {benefits.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-[#CBD5E1] transition-all cursor-default whitespace-nowrap"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.35)";
                    (e.currentTarget as HTMLElement).style.color = "#E2E8F0";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#CBD5E1";
                  }}
                >
                  <Icon className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — phone visual with tilt */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[480px] mx-auto">

              {/* Outer ambient glow */}
              <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(59,130,246,0.20) 0%, transparent 70%)",
                  filter: "blur(24px)",
                  transform: "scale(1.20)",
                }} />

              {/* Tilt wrapper */}
              <div
                ref={imageRef}
                className="relative"
                style={{ transition: "transform 0.12s ease-out", willChange: "transform" }}
              >
                {/* Image card */}
                <div
                  className="relative rounded-[2.5rem] overflow-hidden"
                  style={{
                    border: "1px solid rgba(59,130,246,0.28)",
                    boxShadow: "0 0 80px rgba(59,130,246,0.18), 0 24px 70px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  <Image
                    src="/imagen2.png"
                    alt="Celulares Mobile World"
                    width={600}
                    height={480}
                    className="object-cover w-full h-[340px] lg:h-[440px]"
                    priority
                    style={{ transition: "transform 0.6s ease" }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B18]/55 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, transparent 50%, rgba(139,92,246,0.08) 100%)" }} />

                  {/* Shine sweep on hover — CSS only */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Bottom glow */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-6 pointer-events-none"
                  style={{ background: "rgba(59,130,246,0.30)", filter: "blur(18px)", borderRadius: "50%" }} />
              </div>

              {/* Floating card — stock (parallax via ref) */}
              <div
                ref={card1Ref}
                className="absolute -left-4 sm:-left-8 top-10 px-4 py-3 rounded-2xl hidden sm:block"
                style={{
                  background: "rgba(6,11,24,0.88)",
                  border: "1px solid rgba(0,212,255,0.28)",
                  backdropFilter: "blur(18px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 24px rgba(0,212,255,0.10)",
                  transition: "transform 0.10s ease-out",
                  willChange: "transform",
                }}
              >
                <p className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider mb-1.5">Disponibilidad</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span className="text-white font-bold text-sm">Stock permanente</span>
                </div>
              </div>

              {/* Floating card — wholesale (parallax via ref) */}
              <div
                ref={card2Ref}
                className="absolute -right-4 sm:-right-8 bottom-12 px-4 py-3.5 rounded-2xl hidden sm:block"
                style={{
                  background: "linear-gradient(135deg, rgba(29,78,216,0.92) 0%, rgba(79,70,229,0.92) 100%)",
                  border: "1px solid rgba(96,165,250,0.32)",
                  backdropFilter: "blur(18px)",
                  boxShadow: "0 4px 28px rgba(29,78,216,0.45), 0 0 30px rgba(139,92,246,0.15)",
                  transition: "transform 0.10s ease-out",
                  willChange: "transform",
                }}
              >
                <p className="text-[10px] font-bold text-[#BFDBFE] uppercase tracking-wider mb-1">Para revendedores</p>
                <p className="text-white font-bold text-sm">Precios mayoristas</p>
                <p className="text-[#93C5FD] text-xs mt-0.5">Consultá listas →</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand strip */}
        <div className="mt-16 lg:mt-20 pt-10 border-t border-white/[0.06]">
          <p className="text-center text-[10px] font-semibold text-[#334155] uppercase tracking-[0.18em] mb-6">
            Marcas disponibles
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
            {["Nokia", "Samsung", "Motorola", "Mobi", "CAT"].map((brand) => (
              <span
                key={brand}
                className="font-bold text-base lg:text-lg transition-all duration-300 cursor-default select-none"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "#334155",
                  letterSpacing: "-0.02em",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#00D4FF";
                  (e.currentTarget as HTMLElement).style.textShadow = "0 0 20px rgba(0,212,255,0.40)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "#334155";
                  (e.currentTarget as HTMLElement).style.textShadow = "none";
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
