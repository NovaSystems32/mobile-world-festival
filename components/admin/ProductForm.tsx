"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/types";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { uploadProductImage } from "@/lib/actions/upload";
import { slugify } from "@/lib/utils";
import { Save, ArrowLeft, Upload, X, ImagePlus, Loader2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ── Field fuera del componente para evitar re-mount en cada render ──
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-[#94A3B8] text-xs font-semibold mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-[#EF4444]">*</span>}
      </label>
      {children}
    </div>
  );
}

interface Props {
  product?: Product;
  categories: Category[];
}

const MAX_IMAGES = 5;

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Images: array of URLs (existing + newly uploaded)
  const [images, setImages] = useState<string[]>(() => {
    const imgs: string[] = [];
    if (product?.main_image) imgs.push(product.main_image);
    if (product?.images) {
      product.images.forEach((img) => {
        if (img && img !== product.main_image) imgs.push(img);
      });
    }
    return imgs;
  });
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    wholesale_price: product?.wholesale_price?.toString() || "",
    sku: product?.sku || "",
    stock: product?.stock?.toString() || "0",
    low_stock_alert: product?.low_stock_alert?.toString() || "3",
    category_id: product?.category_id || "",
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    is_wholesale: product?.is_wholesale ?? false,
    condition: product?.condition || "new",
  });

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: product ? f.slug : slugify(name) }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const available = MAX_IMAGES - images.length;
    const toUpload = files.slice(0, available);

    for (const file of toUpload) {
      const idx = images.length;
      setUploadingIdx(idx);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const url = await uploadProductImage(fd);
        setImages((prev) => [...prev, url]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error al subir imagen.");
      }
    }
    setUploadingIdx(null);
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    if (mainImageIndex >= idx && mainImageIndex > 0) {
      setMainImageIndex((i) => i - 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const mainImage = images[mainImageIndex] || images[0] || undefined;

    const payload = {
      ...form,
      price: parseFloat(form.price),
      wholesale_price: form.wholesale_price ? parseFloat(form.wholesale_price) : null,
      stock: parseInt(form.stock),
      low_stock_alert: parseInt(form.low_stock_alert),
      category_id: form.category_id || null,
      main_image: mainImage,
      images,
    };

    try {
      if (product) {
        await updateProduct(product.id, payload as Partial<Product>);
      } else {
        await createProduct(payload as Partial<Product>);
      }
      router.push("/admin/productos");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar el producto.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#334155] focus:outline-none transition-colors";
  const inputStyle = {
    background: "#131F30",
    border: "1px solid #223040",
  };
  const inputFocusHandler = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.currentTarget.style.borderColor = "rgba(59,130,246,0.50)"),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.currentTarget.style.borderColor = "#223040"),
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/productos"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:text-white transition-all"
          style={{ background: "#131F30", border: "1px solid #1E2D42" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {product ? "Editar producto" : "Nuevo producto"}
          </h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {product ? product.name : "Completá los datos del nuevo producto"}
          </p>
        </div>
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Información básica ── */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#111D2E", border: "1px solid #1C2B3E" }}>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">1</span>
            Información básica
          </h2>

          <Field label="Nombre" required>
            <input type="text" value={form.name} onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Nokia 106" required className={inputClass} style={inputStyle} {...inputFocusHandler} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug (URL)">
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="nokia-106" className={inputClass} style={inputStyle} {...inputFocusHandler} />
            </Field>
            <Field label="SKU">
              <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="MW-001" className={inputClass} style={inputStyle} {...inputFocusHandler} />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción del producto..."
              className={inputClass + " resize-none"}
              style={inputStyle}
              {...inputFocusHandler}
            />
          </Field>
        </div>

        {/* ── Precios y stock ── */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#111D2E", border: "1px solid #1C2B3E" }}>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-green-500/20 flex items-center justify-center text-[10px] text-green-400 font-bold">2</span>
            Precios (USD) y stock
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio minorista (USD)" required>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] text-sm font-semibold">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v)) setForm((f) => ({ ...f, price: v }));
                  }}
                  placeholder="21.90"
                  required
                  className={inputClass + " pl-7"} style={inputStyle} {...inputFocusHandler}
                />
              </div>
            </Field>
            <Field label="Precio mayorista (USD)">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569] text-sm font-semibold">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={form.wholesale_price}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9]*\.?[0-9]*$/.test(v)) setForm((f) => ({ ...f, wholesale_price: v }));
                  }}
                  placeholder="18.50"
                  className={inputClass + " pl-7"} style={inputStyle} {...inputFocusHandler}
                />
              </div>
            </Field>
            <Field label="Stock" required>
              <input
                type="text"
                inputMode="numeric"
                value={form.stock}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^[0-9]*$/.test(v)) setForm((f) => ({ ...f, stock: v }));
                }}
                required className={inputClass} style={inputStyle} {...inputFocusHandler}
              />
            </Field>
            <Field label="Alerta stock bajo">
              <input
                type="text"
                inputMode="numeric"
                value={form.low_stock_alert}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^[0-9]*$/.test(v)) setForm((f) => ({ ...f, low_stock_alert: v }));
                }}
                className={inputClass} style={inputStyle} {...inputFocusHandler}
              />
            </Field>
          </div>
        </div>

        {/* ── Clasificación ── */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#111D2E", border: "1px solid #1C2B3E" }}>
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-400 font-bold">3</span>
            Clasificación
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoría">
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className={inputClass} style={{ ...inputStyle, cursor: "pointer" }} {...inputFocusHandler}>
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Condición">
              <select value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value as "new" | "used" | "refurbished" })}
                className={inputClass} style={{ ...inputStyle, cursor: "pointer" }} {...inputFocusHandler}>
                <option value="new">Nuevo</option>
                <option value="used">Usado seleccionado</option>
                <option value="refurbished">Reacondicionado</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            {[
              { key: "is_active", label: "Activo (visible en el sitio)" },
              { key: "is_featured", label: "Destacado" },
              { key: "is_wholesale", label: "Disponible para mayoristas" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#3B82F6]" />
                <span className="text-[#94A3B8] text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Imágenes ── */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#111D2E", border: "1px solid #1C2B3E" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-400 font-bold">4</span>
              Fotos del producto
            </h2>
            <span className="text-[#475569] text-xs">{images.length}/{MAX_IMAGES} fotos</span>
          </div>

          {/* Grid de imágenes */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden aspect-square cursor-pointer"
                style={{
                  border: idx === mainImageIndex
                    ? "2px solid #3B82F6"
                    : "1px solid #223040",
                  background: "#111D2E",
                }}
                onClick={() => setMainImageIndex(idx)}
                title="Clic para establecer como foto principal"
              >
                <Image src={url} alt={`Foto ${idx + 1}`} fill className="object-contain p-1"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />

                {/* Principal badge */}
                {idx === mainImageIndex && (
                  <div className="absolute top-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                    style={{ background: "#3B82F6", color: "white" }}>
                    <Star className="w-2.5 h-2.5" />
                    Principal
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(239,68,68,0.90)" }}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}

            {/* Upload slot — spinner while uploading */}
            {uploadingIdx !== null && (
              <div className="rounded-xl aspect-square flex flex-col items-center justify-center gap-1"
                style={{ border: "1px dashed rgba(59,130,246,0.40)", background: "rgba(59,130,246,0.05)" }}>
                <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                <span className="text-[10px] text-[#3B82F6]">Subiendo...</span>
              </div>
            )}

            {/* Add button */}
            {images.length < MAX_IMAGES && uploadingIdx === null && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl aspect-square flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                style={{ border: "1.5px dashed rgba(255,255,255,0.15)", background: "#0F1A29" }}
              >
                <ImagePlus className="w-5 h-5 text-[#475569]" />
                <span className="text-[10px] text-[#475569]">Agregar</span>
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES || uploadingIdx !== null}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            {uploadingIdx !== null
              ? <><Loader2 className="w-4 h-4 animate-spin" />Subiendo foto...</>
              : <><Upload className="w-4 h-4" />Subir fotos desde la computadora</>
            }
          </button>

          <p className="text-[#334155] text-xs">
            Podés subir hasta {MAX_IMAGES} fotos · JPG, PNG o WEBP · Máx. 5 MB c/u · Hacé clic en una foto para establecerla como <strong className="text-[#475569]">foto principal</strong>
          </p>
        </div>

        {/* ── Submit ── */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-60 transition-all"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", boxShadow: "0 4px 16px rgba(59,130,246,0.25)" }}
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</>
              : <><Save className="w-4 h-4" />{product ? "Guardar cambios" : "Crear producto"}</>
            }
          </button>
          <Link
            href="/admin/productos"
            className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: "#131F30", border: "1px solid #1E2D42", color: "#64748B" }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
