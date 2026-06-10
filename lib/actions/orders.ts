"use server";

import { createClient } from "@/lib/supabase/server";
import { Order, OrderItem, OrderStatus } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  total: number;
}) {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .insert([{ ...data, status: "pending" }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  return order as Order;
}

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as Order[];
}

export async function getPendingOrdersCount() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}

export async function updateOrderStatus(id: string, status: OrderStatus, notes?: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, notes, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();
  await supabase.from("orders").delete().eq("id", id);
  revalidatePath("/admin/pedidos");
}
