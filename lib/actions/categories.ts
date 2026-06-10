"use server";

import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) return [];
  return data as Category[];
}

export async function createCategory(formData: Partial<Category>) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert([formData]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categorias");
}

export async function updateCategory(id: string, formData: Partial<Category>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categorias");
}
