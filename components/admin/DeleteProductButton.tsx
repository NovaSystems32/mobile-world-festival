"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    await deleteProduct(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
