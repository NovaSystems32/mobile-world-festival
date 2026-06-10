import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Mail, MapPin, Camera, Share2 } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

const navLinks = [
  { href: "/#inicio",        label: "Inicio" },
  { href: "/#productos",     label: "Productos" },
  { href: "/#mayoristas",    label: "Mayoristas" },
  { href: "/#quienes-somos", label: "Nosotros" },
  { href: "/#contacto",      label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              {/* Logo frame — igual que el header */}
              <div
                className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.25) 0%, rgba(10,15,30,0.90) 70%)",
                  border: "1.5px solid rgba(59,130,246,0.35)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.20), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <div className="relative w-9 h-9">
                  <Image src="/logo.png" alt="Mobile World" fill className="object-contain" />
                </div>
              </div>
              {/* Business name */}
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em", color: "#F1F5F9" }}>
                  Mobile World
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "11px", letterSpacing: "0.08em", color: "#00D4FF", textTransform: "uppercase" }}>
                  Festival
                </span>
              </div>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
              Tu destino de confianza para celulares y accesorios tecnológicos.
              Venta mayorista y minorista con la mejor atención personalizada.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Camera,  href: "https://instagram.com", label: "Instagram" },
                { icon: Share2,  href: "https://facebook.com",  label: "Facebook"  },
                { icon: MessageCircle, href: whatsappLink(), label: "WhatsApp" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-white/30 hover:bg-white/15 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-display font-bold text-sm text-white mb-5 uppercase tracking-wider">
              Navegación
            </p>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[#94A3B8] hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display font-bold text-sm text-white mb-5 uppercase tracking-wider">
              Contacto
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-[#4ADE80] flex-shrink-0 mt-0.5" />
                <span className="text-[#94A3B8] text-sm">+54 9 351 237 3751</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#60A5FA] flex-shrink-0 mt-0.5" />
                <span className="text-[#94A3B8] text-sm break-all">info@mobileworldfestival.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C084FC] flex-shrink-0 mt-0.5" />
                <span className="text-[#94A3B8] text-sm">Acuña 45</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#475569] text-xs">
            © {new Date().getFullYear()} Mobile World. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacidad" className="text-[#475569] hover:text-[#94A3B8] text-xs transition-colors">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="text-[#475569] hover:text-[#94A3B8] text-xs transition-colors">
              Términos de uso
            </Link>
          </div>
        </div>
        {/* Developer credit */}
        <div className="border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-2">
            <span className="text-[#334155] text-[11px]">Desarrollado por</span>
            <div className="relative w-20 h-5">
              <Image src="/logoweb.png" alt="Web Studio" fill className="object-contain object-left" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
