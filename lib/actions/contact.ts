"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContact(formData: {
  name: string;
  phone?: string;
  email?: string;
  message: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert([formData]);
  if (error) throw new Error(error.message);
}

export async function getContactMessages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function getUnreadCount() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);
  return count ?? 0;
}

export async function markMessageRead(id: string) {
  const supabase = await createClient();
  await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);
  revalidatePath("/admin/contactos");
  revalidatePath("/admin");
}

export async function markAllRead() {
  const supabase = await createClient();
  await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("is_read", false);
  revalidatePath("/admin/contactos");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/contactos");
}
