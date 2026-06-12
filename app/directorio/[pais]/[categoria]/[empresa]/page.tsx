import Link from "next/link";
import { notFound } from "next/navigation";
import { getPais, getCategoria, getEmpresa } from "@/lib/directorio-data";

interface Props {
  params: Promise<{ pais: string; categoria: string; empresa: string }>;
}

export default async function EmpresaPage({ params }: Props) {
  const { pais: paisSlug, categoria: catSlug, empresa: empresaSlug } = await params;
  const pais = getPais(paisSlug);
  const categoria = getCategoria(catSlug);
  const empresa = getEmpresa(paisSlug, catSlug, empresaSlug);
  if (!pais || !categoria || !empresa) notFound();

  const lines = empresa.logoText.split("\n");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <Link href={`/directorio/${paisSlug}/${catSlug}`} className="text-blue-400 text-sm font-medium">
          ← {categoria.nombre}
        </Link>
      </div>

      {/* Logo & Name */}
      <div className="flex flex-col items-center px-4 pb-6">
        <div
          className="w-24 h-24 rounded-[22%] flex flex-col items-center justify-center shadow-2xl mb-4"
          style={{ backgroundColor: empresa.logoColor }}
        >
          {lines.map((line, i) => (
            <span
              key={i}
              className="text-white font-bold leading-none text-center"
              style={{ fontSize: lines.length > 1 ? "12px" : "24px" }}
            >
              {line}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-white text-center">{empresa.nombre}</h1>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {empresa.destacado && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">★ DESTACADO</span>
          )}
          {empresa.premium && (
            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">★ PREMIUM</span>
          )}
          {empresa.patrocinado && (
            <span className="bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">★ PATROCINADO</span>
          )}
        </div>

        {/* Tags */}
        {empresa.tags && empresa.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-3">
            {empresa.tags.map((tag) => (
              <span key={tag} className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mx-4 mb-4" />

      {/* Content */}
      <div className="px-4 space-y-5 pb-32">
        {/* Description */}
        {empresa.descripcion && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sobre la empresa</h2>
            <p className="text-gray-200 text-sm leading-relaxed">{empresa.descripcion}</p>
          </section>
        )}

        {/* Contact Info */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contacto</h2>
          <div className="space-y-2 rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
            {empresa.telefono && (
              <a href={`tel:${empresa.telefono}`} className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-gray-500 text-xs">Teléfono</p>
                  <p className="text-white text-sm">{empresa.telefono}</p>
                </div>
              </a>
            )}
            {empresa.email && (
              <a href={`mailto:${empresa.email}`} className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <span className="text-xl">✉️</span>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="text-white text-sm">{empresa.email}</p>
                </div>
              </a>
            )}
            {empresa.website && (
              <a href={empresa.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <span className="text-xl">🌐</span>
                <div>
                  <p className="text-gray-500 text-xs">Sitio web</p>
                  <p className="text-blue-400 text-sm">{empresa.website.replace("https://", "")}</p>
                </div>
              </a>
            )}
            {empresa.direccion && (
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-gray-500 text-xs">Dirección</p>
                  <p className="text-white text-sm">{empresa.direccion}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Social Media */}
        {(empresa.instagram || empresa.facebook) && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Redes sociales</h2>
            <div className="space-y-2 rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              {empresa.instagram && (
                <a
                  href={`https://instagram.com/${empresa.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
                >
                  <span className="text-xl">📸</span>
                  <div>
                    <p className="text-gray-500 text-xs">Instagram</p>
                    <p className="text-pink-400 text-sm">@{empresa.instagram}</p>
                  </div>
                </a>
              )}
              {empresa.facebook && (
                <a
                  href={`https://facebook.com/${empresa.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-gray-500 text-xs">Facebook</p>
                    <p className="text-blue-400 text-sm">{empresa.facebook}</p>
                  </div>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Catalogs */}
        {empresa.catalogos && empresa.catalogos.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Catálogos</h2>
            <div className="space-y-2 rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
              {empresa.catalogos.map((cat, i) => (
                <a
                  key={i}
                  href={cat.url}
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-xl">📄</span>
                  <p className="text-white text-sm flex-1">{cat.nombre}</p>
                  <span className="text-gray-500 text-lg">↓</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Location breadcrumb */}
        <div className="text-center pt-2">
          <p className="text-gray-600 text-xs">
            {pais.bandera} {pais.nombre} · {categoria.nombre}
          </p>
        </div>
      </div>

      {/* Fixed WhatsApp button */}
      {empresa.whatsapp && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-3" style={{ background: "linear-gradient(to top, black, transparent)" }}>
          <div className="mx-auto max-w-[480px] w-full px-4">
            <a
              href={`https://wa.me/${empresa.whatsapp}?text=Hola ${empresa.nombre}, te contacto desde Mobile World Festival`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-2xl text-base transition-colors"
            >
              <span className="text-xl">💬</span>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
