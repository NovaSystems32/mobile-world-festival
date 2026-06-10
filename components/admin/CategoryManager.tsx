"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/categories";
import { slugify } from "@/lib/utils";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    await createCategory({ name: newName, slug: slugify(newName) });
    setNewName("");
    setCreating(false);
    router.refresh();
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return;
    await updateCategory(id, { name: editName, slug: slugify(editName) });
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar categoría "${name}"?`)) return;
    await deleteCategory(id);
    router.refresh();
  }

  return (
    <div className="space-y-4 max-w-xl">
      {/* Create */}
      <div className="glass rounded-2xl p-4">
        <p className="text-white font-semibold text-sm mb-3">Nueva categoría</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ej: Celulares"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#111118] border border-[#27272A] text-white placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6] text-sm"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 btn-gradient rounded-xl text-white text-sm font-medium disabled:opacity-50"
          >
            {creating ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Crear
          </button>
        </div>
        {newName && (
          <p className="text-[#52525B] text-xs mt-2">Slug: {slugify(newName)}</p>
        )}
      </div>

      {/* List */}
      <div className="glass rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="py-10 text-center text-[#A1A1AA] text-sm">
            No hay categorías. Creá la primera.
          </p>
        ) : (
          <ul className="divide-y divide-[#27272A]">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#16161F] transition-colors"
              >
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(cat.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#111118] border border-[#3B82F6] text-white text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="w-7 h-7 rounded-lg bg-[#22C55E]/10 hover:bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E]"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-7 h-7 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-white text-sm font-medium">{cat.name}</p>
                      <p className="text-[#52525B] text-xs">/{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
