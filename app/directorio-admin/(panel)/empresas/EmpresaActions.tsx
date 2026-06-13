"use client";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function EmpresaActions({ id, activa }: { id: string; activa: boolean }) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function toggleActiva() {
    await supabase.from("directorio_empresas").update({ activa: !activa }).eq("id", id);
    router.refresh();
  }

  async function eliminar() {
    if (!confirm("¿Eliminar esta empresa? Esta acción no se puede deshacer.")) return;
    await supabase.from("directorio_empresas").delete().eq("id", id);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/directorio-admin/empresas/${id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-900/20 transition-colors">
        Editar
      </Link>
      <button onClick={toggleActiva} className="text-yellow-400 hover:text-yellow-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-yellow-900/20 transition-colors">
        {activa ? "Desactivar" : "Activar"}
      </button>
      <button onClick={eliminar} className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-900/20 transition-colors">
        Eliminar
      </button>
    </div>
  );
}
