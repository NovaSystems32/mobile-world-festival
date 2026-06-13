"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { paises, categorias } from "@/lib/directorio-data";

const COLORES = [
  "#0984e3", "#00b894", "#d63031", "#e17055", "#a29bfe",
  "#fdcb6e", "#00cec9", "#636e72", "#e91e8c", "#795548",
  "#2d3436", "#6c5ce7", "#fd79a8", "#55efc4", "#fab1a0",
];

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
    logo_color: empresa?.logo_color ?? "#0984e3",
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
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
    }
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
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/directorio-admin/empresas");
      router.refresh();
    }
  }

  const inputClass = "w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {/* Info básica */}
      <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="font-semibold text-white mb-4">Información básica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input required value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej: Tecnosel" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="tecnosel" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>País *</label>
            <select required value={form.pais} onChange={(e) => set("pais", e.target.value)} className={inputClass}>
              {paises.map((p) => <option key={p.slug} value={p.slug}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoría *</label>
            <select required value={form.categoria} onChange={(e) => set("categoria", e.target.value)} className={inputClass}>
              {categorias.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} rows={3} placeholder="Descripción de la empresa..." className={inputClass} />
        </div>
      </section>

      {/* Logo */}
      <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="font-semibold text-white mb-4">Logo</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[22%] flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: form.logo_color }}>
            {form.logo_texto || form.nombre.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <label className={labelClass}>Texto del logo</label>
              <input value={form.logo_texto} onChange={(e) => set("logo_texto", e.target.value)} placeholder="Ej: TCNO o T|P" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {COLORES.map((c) => (
                  <button key={c} type="button" onClick={() => set("logo_color", c)}
                    className={`w-8 h-8 rounded-lg transition-transform ${form.logo_color === c ? "ring-2 ring-white scale-110" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="font-semibold text-white mb-4">Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={labelClass}>Teléfono</label><input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="+54 11 1234-5678" className={inputClass} /></div>
          <div><label className={labelClass}>WhatsApp (solo números)</label><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5491112345678" className={inputClass} /></div>
          <div><label className={labelClass}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@empresa.com" className={inputClass} /></div>
          <div><label className={labelClass}>Sitio web</label><input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://empresa.com" className={inputClass} /></div>
          <div><label className={labelClass}>Instagram (sin @)</label><input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="empresa" className={inputClass} /></div>
          <div><label className={labelClass}>Facebook</label><input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="empresa" className={inputClass} /></div>
          <div className="md:col-span-2"><label className={labelClass}>Dirección</label><input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Av. Corrientes 1234, CABA" className={inputClass} /></div>
        </div>
      </section>

      {/* Plan y configuración */}
      <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="font-semibold text-white mb-4">Plan y visibilidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Plan</label>
            <select value={form.plan} onChange={(e) => set("plan", e.target.value)} className={inputClass}>
              <option value="regular">Regular</option>
              <option value="destacado">⭐ Destacado</option>
              <option value="premium">👑 Premium</option>
              <option value="patrocinado">📢 Patrocinado</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Badge (número)</label>
            <input type="number" min="0" value={form.badge} onChange={(e) => set("badge", parseInt(e.target.value) || 0)} className={inputClass} />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-12 h-6 rounded-full transition-colors ${form.activa ? "bg-green-500" : "bg-gray-600"}`} onClick={() => set("activa", !form.activa)}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.activa ? "translate-x-7" : "translate-x-1"}`} />
              </div>
              <span className="text-gray-300 text-sm">{form.activa ? "Activa" : "Inactiva"}</span>
            </label>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h2 className="font-semibold text-white mb-4">Tags</h2>
        <div className="flex gap-2 mb-3">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Ej: Celulares" className={`${inputClass} flex-1`} />
          <button type="button" onClick={addTag} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">Agregar</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full">
              {tag}
              <button type="button" onClick={() => set("tags", form.tags.filter((t) => t !== tag))} className="text-gray-500 hover:text-red-400 transition-colors">×</button>
            </span>
          ))}
        </div>
      </section>

      {/* Botones */}
      <div className="flex items-center gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear empresa"}
        </button>
      </div>
    </form>
  );
}
