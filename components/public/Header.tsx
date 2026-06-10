"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { useCart } from "@/store/cartStore";

const navLinks = [
  { href: "/#inicio",        label: "Inicio" },
  { href: "/#productos",     label: "Productos" },
  { href: "/#mayoristas",    label: "Mayoristas" },
  { href: "/#quienes-somos", label: "Nosotros" },
  { href: "/#contacto",      label: "Contacto" },
];

export default function Header() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items }               = useCart();
  const totalItems              = items.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.40)]"
          : "bg-transparent"
      }`}
    >
      {/* Top info bar */}
      <div
        className="hidden lg:block border-b border-white/[0.06]"
        style={{ background: "rgba(15,22,41,0.80)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-2">
          <span className="text-[#64748B] text-xs">
            Venta mayorista y minorista · Stock permanente · Envíos disponibles
          </span>
          <a
            href={whatsappLink("Hola, quisiera consultar sobre sus productos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#4ADE80] hover:text-[#86EFAC] transition-colors text-xs font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            +54 9 351 237 3751
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">

          {/* Logo — rounded frame with glow + name */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                background: "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.25) 0%, rgba(10,15,30,0.90) 70%)",
                border: "1.5px solid rgba(59,130,246,0.35)",
                boxShadow: "0 0 20px rgba(59,130,246,0.20), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 32px rgba(0,212,255,0.45), 0 0 12px rgba(139,92,246,0.30), inset 0 1px 0 rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.55)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.06)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 20px rgba(59,130,246,0.20), inset 0 1px 0 rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.35)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <div className="relative w-9 h-9">
                <Image
                  src="/logo.png"
                  alt="Mobile World"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Business name */}
            <div className="hidden sm:flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "-0.02em",
                  color: "#F1F5F9",
                }}
              >
                Mobile World
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  color: "#00D4FF",
                  textTransform: "uppercase",
                }}
              >
                Festival
              </span>
            </div>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[14px] font-medium text-[#94A3B8] hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#64748B] hover:text-white hover:bg-white/[0.08] transition-all">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#3B82F6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* WhatsApp CTA */}
            <a
              href={whatsappLink("Hola, quisiera consultar sobre sus productos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex btn-whatsapp text-sm py-2.5 px-5"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/[0.08] transition-all"
              aria-label="Menú"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[420px]" : "max-h-0"
        }`}
        style={{ background: "rgba(10,15,30,0.98)", backdropFilter: "blur(20px)" }}
      >
        <div className="border-t border-white/[0.06] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/[0.07] font-medium transition-all text-sm"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/[0.06]">
            <a
              href={whatsappLink("Hola, quisiera consultar sobre sus productos.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
