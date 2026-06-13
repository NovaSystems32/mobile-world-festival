import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/directorio-admin/login");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">🌎</div>
              <div>
                <p className="font-bold text-white text-sm">Panel Directorio</p>
                <p className="text-gray-400 text-xs">Mobile World Festival</p>
              </div>
            </div>
          </div>
          <nav className="p-4 flex-1 space-y-1">
            <Link href="/directorio-admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm">
              <span>📊</span> Dashboard
            </Link>
            <Link href="/directorio-admin/empresas" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm">
              <span>🏢</span> Empresas
            </Link>
            <Link href="/directorio-admin/empresas/nueva" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm">
              <span>➕</span> Nueva empresa
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Link href="/directorio" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <span>👁️</span> Ver directorio
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-64 flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
