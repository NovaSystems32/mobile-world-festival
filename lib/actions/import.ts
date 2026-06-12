"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface ExcelRow {
  "Nombre"?: string;
  "SKU"?: string;
  "Precio (USD)"?: string | number;
  "Precio Mayorista"?: string | number;
  "Stock"?: string | number;
  "Stock Mínimo"?: string | number;
  "Categoría"?: string;
  "Condición"?: string;
  "Activo"?: string;
  "Destacado"?: string;
  "Mayorista"?: string;
  "Descripción"?: string;
  "Slug"?: string;
}

export async function importProductsFromExcel(
  rows: ExcelRow[]
): Promise<{ created: number; updated: number; errors: string[] }> {
  const supabase = await createClient();
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  // Cargar categorías existentes
  const { data: cats } = await supabase.from("categories").select("id, name");
  const catMap: Record<string, string> = {};
  for (const c of cats || []) catMap[c.name.toLowerCase()] = c.id;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // Excel fila (1=header)

    const name = String(row["Nombre"] || "").trim();
    if (!name) { errors.push(`Fila ${rowNum}: nombre vacío, se omite.`); continue; }

    const price = parseFloat(String(row["Precio (USD)"] || "0"));
    if (isNaN(price) || price < 0) { errors.push(`Fila ${rowNum}: precio inválido.`); continue; }

    const slug = row["Slug"] ? String(row["Slug"]).trim() : slugify(name);
    const sku  = String(row["SKU"] || "").trim() || undefined;
    const wholesale_price = row["Precio Mayorista"] ? parseFloat(String(row["Precio Mayorista"])) : null;
    const stock       = parseInt(String(row["Stock"] || "0"), 10) || 0;
    const low_stock_alert = parseInt(String(row["Stock Mínimo"] || "3"), 10) || 3;
    const description = String(row["Descripción"] || "").trim() || null;

    const condRaw = String(row["Condición"] || "").toLowerCase();
    const condition = condRaw.includes("usado") ? "used" : condRaw.includes("reac") ? "refurbished" : "new";

    const is_active    = String(row["Activo"]    || "si").toLowerCase() !== "no";
    const is_featured  = String(row["Destacado"] || "no").toLowerCase() === "sí" || String(row["Destacado"] || "no").toLowerCase() === "si";
    const is_wholesale = String(row["Mayorista"] || "no").toLowerCase() === "sí" || String(row["Mayorista"] || "no").toLowerCase() === "si";

    const catName = String(row["Categoría"] || "").trim().toLowerCase();
    const category_id = catMap[catName] || null;

    const payload = {
      name, slug, price, sku: sku || null, wholesale_price,
      stock, low_stock_alert, description,
      condition, is_active, is_featured, is_wholesale, category_id,
    };

    // Ver si ya existe por slug o SKU
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("products").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", existing.id);
      if (error) errors.push(`Fila ${rowNum} (${name}): ${error.message}`);
      else updated++;
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) errors.push(`Fila ${rowNum} (${name}): ${error.message}`);
      else created++;
    }
  }

  revalidatePath("/admin/stock");
  revalidatePath("/admin/productos");
  revalidatePath("/admin");
  return { created, updated, errors };
}
