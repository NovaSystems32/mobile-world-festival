import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EmpresaForm from "../EmpresaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarEmpresaPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: empresa } = await supabase.from("directorio_empresas").select("*").eq("id", id).single();
  if (!empresa) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Editar empresa</h1>
        <p className="text-gray-400 text-sm mt-1">{empresa.nombre}</p>
      </div>
      <EmpresaForm empresa={empresa} />
    </div>
  );
}
