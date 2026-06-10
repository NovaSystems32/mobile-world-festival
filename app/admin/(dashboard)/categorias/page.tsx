import { getCategories } from "@/lib/actions/categories";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function CategoriasPage() {
  const categories = await getCategories();
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-white font-display font-bold text-2xl">Categorías</h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Gestioná las categorías de tus productos.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
