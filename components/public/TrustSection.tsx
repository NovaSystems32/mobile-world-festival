import Image from "next/image";
import { Headphones, RefreshCw, ShieldCheck, Wifi } from "lucide-react";

const indicators = [
  {
    icon: Headphones,
    title: "Atención personalizada",
    desc: "Asesoramiento real para cada necesidad y presupuesto.",
  },
  {
    icon: RefreshCw,
    title: "Stock actualizado",
    desc: "Disponibilidad verificada en tiempo real.",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    desc: "Transacciones confiables y transparentes siempre.",
  },
  {
    icon: Wifi,
    title: "Comunidad tech",
    desc: "Parte del ecosistema tecnológico argentino.",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&q=70&auto=format&fit=crop",
    alt: "Variedad de smartphones",
    span: "col-span-1 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=70&auto=format&fit=crop",
    alt: "Accesorios tecnológicos",
    span: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1600262605195-48f4b49b7c8a?w=500&q=70&auto=format&fit=crop",
    alt: "Atención al cliente tecnología",
    span: "col-span-1",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="section-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Photo gallery */}
        <div>
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4">Nuestra propuesta</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0F172A]">
              Tecnología para todos
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Tall left image */}
            <div className="row-span-2 relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.08)]" style={{ minHeight: 280 }}>
              <Image
                src="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&q=70&auto=format&fit=crop"
                alt="Variedad de smartphones"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Top right */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.08)]" style={{ height: 130 }}>
              <Image
                src="https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=70&auto=format&fit=crop"
                alt="Accesorios tecnológicos"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Bottom right */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.08)]" style={{ height: 130 }}>
              <Image
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=70&auto=format&fit=crop"
                alt="Persona usando smartphone"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {indicators.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group text-center p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#BFDBFE] hover:bg-white hover:shadow-[0_8px_32px_rgba(29,78,216,0.08)] transition-all duration-300"
            >
              <div className="icon-box mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-[#0F172A] text-sm mb-2">{title}</h4>
              <p className="text-[#64748B] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
