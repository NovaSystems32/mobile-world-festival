"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function uploadProductImage(formData: FormData): Promise<string> {
  const cookieStore = await cookies();

  // Usamos service role key para saltear RLS en Storage
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const file = formData.get("file") as File;

  if (!file || file.size === 0) throw new Error("No se recibió ningún archivo.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) throw new Error("Formato no permitido. Usá JPG, PNG o WEBP.");
  if (file.size > 5 * 1024 * 1024) throw new Error("La imagen no puede superar 5 MB.");

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("product.image")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Storage error: ${error.message}`);

  const { data } = supabase.storage.from("product.image").getPublicUrl(path);
  return data.publicUrl;
}
