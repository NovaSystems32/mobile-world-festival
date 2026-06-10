"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStock } from "@/lib/actions/products";
import { Check, Edit2, X } from "lucide-react";

export default function StockUpdateButton({
  productId,
  currentStock,
  productName,
}: {
  productId: string;
  currentStock: number;
  productName: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentStock.toString());
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const n = parseInt(value);
    if (isNaN(n) || n < 0) return;
    setLoading(true);
    await updateStock(productId, n);
    setEditing(false);
    setLoading(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 px-2 py-1.5 rounded-lg bg-[#111118] border border-[#3B82F6] text-white text-sm focus:outline-none"
          autoFocus
          min={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-7 h-7 rounded-lg bg-[#22C55E]/10 hover:bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] transition-all"
        >
          {loading ? (
            <span className="w-3 h-3 border border-[#22C55E]/30 border-t-[#22C55E] rounded-full animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={() => { setEditing(false); setValue(currentStock.toString()); }}
          className="w-7 h-7 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444] transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161F] border border-[#27272A] hover:border-[#3B82F6] text-[#A1A1AA] hover:text-white text-xs font-medium transition-all"
    >
      <Edit2 className="w-3 h-3" />
      Editar
    </button>
  );
}
