import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getAllProductsAdmin } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { createClient } from "@/lib/supabase/server";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(id,name,slug)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const categories = await getCategories();
  return <ProductForm product={product} categories={categories} />;
}
