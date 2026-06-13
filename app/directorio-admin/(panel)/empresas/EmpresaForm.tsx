"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { paises, categorias } from "@/lib/directorio-data";

const COLORES = [
  "#3B82F6", "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#f59e0b", "#10b981", "#06b6d4", "#0ea5e9",
  "#64748b", "#1e293b", "#7c3aed", "#be185d", "#065f46",
];

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

interface Empresa {
  id?: string;
  nombre: string;
  slug: string;
  pais: string;
  categoria: string;
  descripcion: string;
  telefono: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  direccion: string;
  logo_color: string;
  logo_texto: string;
  plan: string;
  badge: number;
  activa: boolean;
  tags: string[];
}

export default function EmpresaForm({ empresa }: { empresa?: Empresa }) {
  const router = useRouter();
  const isEdit = !!empresa?.id;

  const [form, setForm] = useState<Empresa>({
    nombre: empresa?.nombre ?? "",
    slug: empresa?.slug ?? "",
    pais: empresa?.pais ?? "argentina",
    categoria: empresa?.categoria ?? "minorista",
    descripcion: empresa?.descripcion ?? "",
    telefono: empresa?.telefono ?? "",
    whatsapp: empresa?.whatsapp ?? "",
    email: empresa?.email ?? "",
    website: empresa?.website ?? "",
    instagram: empresa?.instagram ?? "",
    facebook: empresa?.facebook ?? "",
    direccion: empresa?.direccion ?? "",
    logo_color: empresa?.logo_color ?? "#3B82F6",
    logo_texto: empresa?.logo_texto ?? "",
    plan: empresa?.plan ?? "regular",
    badge: empresa?.badge ?? 0,
    activa: empresa?.activa ?? true,
    tags: empresa?.tags ?? [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function set(key: keyof Empresa, value: string | number | boolean | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "nombre" && !isEdit) {
      setForm((prev) => ({
        ...prev,
        nombre: value as string,
        slug: (value as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = { ...form };
    let err;
    if (isEdit) {
      ({ error: err } = await supabase.from("directorio_empresas").update(payload).eq("id", empresa!.id!));
    } else {
      ({ error: err } = await supabase.from("directorio_empresas").insert(payload));
    }
    if (err) { setError(err.message); setLoading(false); }
    else { router.push("/directorio-admin/empresas"); router.refresh(); }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/25 outline-none transition-all duration-150";
  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
  const labelClass = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "rgba(255,255,255,0.4)" };
  const sectionStyle = { ...glass, borderRadius: "20px", padding: "24px" };
  const logoDisplay = form.logo_texto || form.nombre.slice(0, 2).toUpperCase() || "AB";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28">
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* Info básica */}
      <section style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Información básica</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Nombre *</label>
            <input required value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej: Tecnosel" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Slug (URL)</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="tecnosel" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>País *</label>
            <select required value={form.pais} onChange={(e) => set("pais", e.target.value)} className={inputClass} style={{ ...inputStyle, appearance: "none" as const }}>
              {paises.map((p) => <option key={p.slug} value={p.slug} style={{ background: "#111827" }}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Categoría *</label>
            <select required value={form.categoria} onChange={(e) => set("categoria", e.target.value)} className={inputClass} style={{ ...inputStyle, appearance: "none" as const }}>
              {categorias.map((c) => <option key={c.slug} value={c.slug} style={{ background: "#111827" }}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass} style={labelStyle}>Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} rows={3} placeholder="Descripción de la empresa..." className={inputClass} style={inputStyle} />
        </div>
      </section>

      {/* Logo */}
      <section style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Logo</p>
        <div className="flex gap-6 items-start">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-20 h-20 rounded-[22%] flex items-center justify-center shadow-2xl" style={{ background: form.logo_color }}>
              <span className="text-white font-bold text-xl tracking-tight">{logoDisplay}</span>
            </div>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Vista previa</span>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className={labelClass} style={labelStyle}>Texto del logo</label>
              <input value={form.logo_texto} onChange={(e) => set("logo_texto", e.target.value)} placeholder="Ej: TC o MWF" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Color</label>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {COLORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("logo_color", c)}
                    className="w-8 h-8 rounded-full transition-all duration-150 flex-shrink-0"
                    style={{
                      backgroundColor: c,
                      boxShadow: form.logo_color === c ? `0 0 0 2px #050814, 0 0 0 4px ${c}` : "none",
                      transform: form.logo_color === c ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Contacto</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelClass} style={labelStyle}>Teléfono</label><input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="+54 11 1234-5678" className={inputClass} style={inputStyle} /></div>
          <div><label className={labelClass} style={labelStyle}>WhatsApp (solo números)</label><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5491112345678" className={inputClass} style={inputStyle} /></div>
          <div><label className={labelClass} style={labelStyle}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@empresa.com" className={inputClass} style={inputStyle} /></div>
          <div><label className={labelClass} style={labelStyle}>Sitio web</label><input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://empresa.com" className={inputClass} style={inputStyle} /></div>
          <div><label className={labelClass} style={labelStyle}>Instagram (sin @)</label><input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="empresa" className={inputClass} style={inputStyle} /></div>
          <div><label className={labelClass} style={labelStyle}>Facebook</label><input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="empresa" className={inputClass} style={inputStyle} /></div>
          <div className="md:col-span-2"><label className={labelClass} style={labelStyle}>Dirección</label><input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Av. Corrientes 1234, CABA" className={inputClass} style={inputStyle} /></div>
        </div>
      </section>

      {/* Plan */}
      <section style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Plan y visibilidad</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>Plan</label>
            <select value={form.plan} onChange={(e) => set("plan", e.target.value)} className={inputClass} style={{ ...inputStyle, appearance: "none" as const }}>
              <option value="regular" style={{ background: "#111827" }}>Regular</option>
              <option value="destacado" style={{ background: "#111827" }}>⭐ Destacado</option>
              <option value="premium" style={{ background: "#111827" }}>👑 Premium</option>
              <option value="patrocinado" style={{ background: "#111827" }}>📢 Patrocinado</option>
            </select>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Badge (número)</label>
            <input type="number" min="0" value={form.badge} onChange={(e) => set("badge", parseInt(e.target.value) || 0)} className={inputClass} style={inputStyle} />
          </div>
          <div className="flex items-end pb-1">
            <button type="button" onClick={() => set("activa", !form.activa)} className="flex items-center gap-3">
              <div className="relative w-12 h-6 rounded-full transition-all duration-200 flex-shrink-0" style={{ background: form.activa ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.1)" }}>
                <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200" style={{ transform: form.activa ? "translateX(28px)" : "translateX(4px)" }} />
              </div>
              <span className="text-sm font-medium" style={{ color: form.activa ? "#10b981" : "rgba(255,255,255,0.4)" }}>
                {form.activa ? "Activa" : "Inactiva"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>Tags</p>
        <div className="flex gap-2 mb-3">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ej: Celulares"
            className={`${inputClass} flex-1`}
            style={inputStyle}
          />
          <button type="button" onClick={addTag} className="px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #3B82F6, #6366f1)" }}>
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}>
              {tag}
              <button type="button" onClick={() => set("tags", form.tags.filter((t) => t !== tag))} className="opacity-50 hover:opacity-100 transition-opacity ml-0.5">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-60 right-0 px-8 py-4 flex items-center justify-end gap-3 z-50"
        style={{
          background: "rgba(5,8,20,0.85)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #3B82F6, #6366f1)" }}
        >
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear empresa"}
        </button>
      </div>
    </form>
  );
}
