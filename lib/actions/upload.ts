"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadProductImage(formData: FormData): Promise<string> {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) throw new Error("No se recibió ningún archivo.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) throw new Error("Formato no permitido. Usá JPG, PNG o WEBP.");
  if (file.size > 5 * 1024 * 1024) throw new Error("La imagen no puede superar 5 MB.");

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("product-image")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Error al subir: ${error.message}`);

  const { data } = supabase.storage.from("product-image").getPublicUrl(path);
  return data.publicUrl;
}
