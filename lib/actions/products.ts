"use server";

import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  wholesale?: boolean;
  limit?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.categorySlug && options.categorySlug !== "all") {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.wholesale) query = query.eq("is_wholesale", true);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) return [];
  return data as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getAllProductsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as Product[];
}

export async function createProduct(formData: Partial<Product>) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert([formData]);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function updateProduct(id: string, formData: Partial<Product>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function updateStock(
  productId: string,
  newStock: number,
  reason?: string
) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  const { error } = await supabase
    .from("products")
    .update({ stock: newStock, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) throw new Error(error.message);

  if (product) {
    await supabase.from("stock_history").insert([
      {
        product_id: productId,
        prev_stock: product.stock,
        new_stock: newStock,
        reason: reason || "Manual update",
      },
    ]);
  }

  revalidatePath("/");
  revalidatePath("/admin/stock");
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("is_active, is_featured, stock, low_stock_alert");
  if (error || !data)
    return { total: 0, active: 0, out_of_stock: 0, featured: 0, low_stock: 0 };

  return {
    total: data.length,
    active: data.filter((p) => p.is_active).length,
    out_of_stock: data.filter((p) => p.stock === 0).length,
    featured: data.filter((p) => p.is_featured).length,
    low_stock: data.filter((p) => p.stock > 0 && p.stock <= p.low_stock_alert)
      .length,
  };
}

export async function getRecentProducts(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, price, stock, is_active, main_image, condition")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
