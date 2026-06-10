"use server";

import { createClient } from "@/lib/supabase/server";
import { Coupon } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as Coupon[];
}

export async function createCoupon(formData: Partial<Coupon>) {
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert([{
    ...formData,
    used_count: 0,
  }]);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/cupones");
}

export async function updateCoupon(id: string, formData: Partial<Coupon>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("coupons")
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/cupones");
}

export async function toggleCoupon(id: string, is_active: boolean) {
  const supabase = await createClient();
  await supabase.from("coupons").update({ is_active, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/cupones");
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient();
  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/cupones");
}
