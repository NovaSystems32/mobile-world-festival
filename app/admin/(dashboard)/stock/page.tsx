import { getAllProductsAdmin } from "@/lib/actions/products";
import { formatPrice, getStockStatus } from "@/lib/utils";
import StockUpdateButton from "@/components/admin/StockUpdateButton";
import StockExcelTools from "@/components/admin/StockExcelTools";

export default async function StockPage() {
  const products = await getAllProductsAdmin();

  const byStatus = {
    out: products.filter((p) => p.stock === 0),
    low: products.filter((p) => p.stock > 0 && p.stock <= p.low_stock_alert),
    ok: products.filter((p) => p.stock > p.low_stock_alert),
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-white font-display font-bold text-2xl">Gestión de Stock</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Actualizá el stock o importá productos desde Excel.</p>
        </div>
        <StockExcelTools />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Sin stock", count: byStatus.out.length, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
          { label: "Stock bajo", count: byStatus.low.length, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
          { label: "Disponibles", count: byStatus.ok.length, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`glass rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <span className={`text-lg font-bold ${color}`}>{count}</span>
            </div>
            <p className="text-[#A1A1AA] text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#27272A]">
          <p className="text-white font-semibold text-sm">Todos los productos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27272A]">
                {["Producto", "Precio", "Stock actual", "Estado", "Actualizar"].map((h) => (
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
                const status = getStockStatus(product.stock, product.low_stock_alert);
                const colors = {
                  green: { dot: "bg-[#22C55E]", text: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
                  yellow: { dot: "bg-[#F59E0B]", text: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
                  red: { dot: "bg-[#EF4444]", text: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
                };
                const c = colors[status.color];
                return (
                  <tr key={product.id} className="hover:bg-[#16161F] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{product.name}</p>
                      {product.sku && <p className="text-[#52525B] text-xs">SKU: {product.sku}</p>}
                    </td>
                    <td className="px-4 py-3 text-[#A1A1AA] text-sm">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-bold text-lg">{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.bg} ${c.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StockUpdateButton
                        productId={product.id}
                        currentStock={product.stock}
                        productName={product.name}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
