import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/actions/products";
import { formatPrice, getStockStatus } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function ProductosPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-display font-bold text-2xl">Productos</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">{products.length} productos en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 btn-gradient px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27272A]">
                {["Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {products.map((product) => {
                const stock = getStockStatus(product.stock, product.low_stock_alert);
                const dotColors = {
                  green: "bg-[#22C55E]",
                  yellow: "bg-[#F59E0B]",
                  red: "bg-[#EF4444]",
                };
                return (
                  <tr key={product.id} className="hover:bg-[#16161F] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white text-sm font-medium">{product.name}</p>
                        {product.sku && (
                          <p className="text-[#52525B] text-xs">SKU: {product.sku}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#A1A1AA] text-sm">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${dotColors[stock.color]}`} />
                        <span className="text-sm text-white">{product.stock}</span>
                        <span className="text-xs text-[#A1A1AA]">({stock.label})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                          product.is_active
                            ? "bg-[#22C55E]/10 text-[#22C55E]"
                            : "bg-[#EF4444]/10 text-[#EF4444]"
                        }`}
                      >
                        {product.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-16 text-center text-[#A1A1AA]">
              No hay productos todavía.{" "}
              <Link href="/admin/productos/nuevo" className="text-[#3B82F6] hover:underline">
                Crear el primero
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
