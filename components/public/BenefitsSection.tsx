"use client";

import Image from "next/image";

const benefits = [
  {
    title: "Venta mayorista y minorista",
    description: "Atendemos a compradores finales, revendedores y comercios con precios diferenciados según volumen.",
    photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop",
    accent: "#1D4ED8",
    tag: "Mayoristas y minoristas",
  },
  {
    title: "Atención personalizada",
    description: "Asesoramiento real de personas reales. Te ayudamos a encontrar el equipo ideal para cada necesidad.",
    photo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop",
    accent: "#0369A1",
    tag: "Soporte humano",
  },
  {
    title: "Productos seleccionados",
    description: "Cada equipo pasa por un proceso de selección. Trabajamos solo con productos de calidad garantizada.",
    photo: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80&auto=format&fit=crop",
    accent: "#15803D",
    tag: "Calidad garantizada",
  },
  {
    title: "Compra segura",
    description: "Transacciones transparentes y confiables. Tu satisfacción es nuestra prioridad en cada operación.",
    photo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80&auto=format&fit=crop",
    accent: "#7C3AED",
    tag: "100% confiable",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: "#F8FAFC" }}>

      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: "linear-gradient(90deg, transparent, #1D4ED8 30%, #8B5CF6 70%, transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5"
            style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}
          >
            Por qué elegirnos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}
          >
            Tu tecnología, nuestra{" "}
            <span style={{
              background: "linear-gradient(90deg, #1D4ED8, #7C3AED)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              prioridad
            </span>
          </h2>
          <p style={{ color: "#64748B", fontSize: "1.1rem", lineHeight: 1.7 }}>
            Más de una década conectando personas con la tecnología que necesitan,
            al precio que se merecen.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ title, description, photo, accent, tag }) => (
            <div
              key={title}
              className="group relative rounded-2xl overflow-hidden cursor-default transition-all duration-300"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = `0 12px 40px rgba(15,23,42,0.12)`;
                el.style.borderColor = `${accent}40`;
                el.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)";
                el.style.borderColor = "#E2E8F0";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={photo}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-106"
                  style={{ transition: "transform 0.5s ease" }}
                />
                {/* Subtle dark overlay */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.25))" }} />

                {/* Tag pill over photo */}
                <div
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: `${accent}CC`, backdropFilter: "blur(8px)" }}
                >
                  {tag}
                </div>

                {/* Accent line at top on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="font-bold text-base mb-2 leading-snug"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0F172A" }}
                >
                  {title}
                </h3>
                <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.65 }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
