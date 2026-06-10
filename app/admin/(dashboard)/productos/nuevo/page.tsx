import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/actions/categories";

export default async function NuevoProductoPage() {
  const categories = await getCategories();
  return <ProductForm categories={categories} />;
}
