import Link from "next/link";
import { notFound } from "next/navigation";
import { getPais, categorias } from "@/lib/directorio-data";
import {
  Building2, ShoppingBag, Truck, Globe2, BookOpen, Smartphone,
  Headphones, Gamepad2, Tablet, Volume2, Cable, Tag,
  Wifi, ShieldCheck, Watch, Sparkles, FolderOpen, MessageSquare,
  Wrench, Settings2,
} from "lucide-react";

interface Props {
  params: Promise<{ pais: string }>;
}

const CATEGORY_ICONS: Record<string, { Icon: React.ElementType; gradient: string }> = {
  mayorista:    { Icon: Building2,     gradient: "linear-gradient(135deg, #4a5568, #2d3748)" },
  minorista:    { Icon: ShoppingBag,   gradient: "linear-gradient(135deg, #38a169, #276749)" },
  distribuidor: { Icon: Truck,         gradient: "linear-gradient(135deg, #e53e3e, #9b2c2c)" },
  importador:   { Icon: Globe2,        gradient: "linear-gradient(135deg, #dd6b20, #9c4221)" },
  comics:       { Icon: BookOpen,      gradient: "linear-gradient(135deg, #805ad5, #553c9a)" },
  electronica:  { Icon: Smartphone,    gradient: "linear-gradient(135deg, #00b4db, #0083b0)" },
  accesorios:   { Icon: Headphones,    gradient: "linear-gradient(135deg, #f093fb, #f5576c)" },
  gaming:       { Icon: Gamepad2,      gradient: "linear-gradient(135deg, #1a1a2e, #16213e)" },
  tablets:      { Icon: Tablet,        gradient: "linear-gradient(135deg, #11998e, #38ef7d)" },
  audio:        { Icon: Volume2,       gradient: "linear-gradient(135deg, #43cea2, #185a9d)" },
  cables:       { Icon: Cable,         gradient: "linear-gradient(135deg, #795548, #5d4037)" },
  ofertas:      { Icon: Tag,           gradient: "linear-gradient(135deg, #e91e8c, #9c1d6a)" },
  redes:        { Icon: Wifi,          gradient: "linear-gradient(135deg, #0984e3, #0652dd)" },
  seguridad:    { Icon: ShieldCheck,   gradient: "linear-gradient(135deg, #636e72, #2d3436)" },
  smartwatch:   { Icon: Watch,         gradient: "linear-gradient(135deg, #b06ab3, #4568dc)" },
  novedades:    { Icon: Sparkles,      gradient: "linear-gradient(135deg, #f7971e, #ffd200)" },
  archivos:     { Icon: FolderOpen,    gradient: "linear-gradient(135deg, #0984e3, #00b4db)" },
  mensajes:     { Icon: MessageSquare, gradient: "linear-gradient(135deg, #00b894, #00cec9)" },
  soporte:      { Icon: Wrench,        gradient: "linear-gradient(135deg, #e17055, #d63031)" },
  config:       { Icon: Settings2,     gradient: "linear-gradient(135deg, #636e72, #4a4f52)" },
};

export default async function PaisPage({ params }: Props) {
  const { pais: paisSlug } = await params;
  const pais = getPais(paisSlug);
  if (!pais) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center gap-3 px-4 pt-12 pb-2">
        <Link href="/directorio" className="text-blue-400 text-sm font-semibold">
          ← Países
        </Link>
      </div>
      <div className="px-4 pb-5">
        <p className="text-gray-400 text-sm font-medium">{pais.bandera} {pais.nombre}</p>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">Categorías</h1>
      </div>
      <div className="px-3 pb-10">
        <div className="grid grid-cols-4 gap-3">
          {categorias.map((cat) => {
            const entry = CATEGORY_ICONS[cat.slug];
            const Icon = entry?.Icon ?? Settings2;
            const gradient = entry?.gradient ?? "linear-gradient(135deg, #4a5568, #2d3748)";
            return (
              <Link key={cat.slug} href={`/directorio/${paisSlug}/${cat.slug}`}>
                <div className="flex flex-col items-center gap-1.5 relative">
                  {cat.badge && cat.badge > 0 ? (
                    <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md">
                      {cat.badge > 99 ? "99+" : cat.badge}
                    </div>
                  ) : null}
                  <div
                    className="w-full aspect-square rounded-[22%] flex items-center justify-center shadow-lg"
                    style={{ background: gradient }}
                  >
                    <Icon size={28} color="white" strokeWidth={1.8} />
                  </div>
                  <span className="text-white text-[11px] text-center leading-tight font-medium">
                    {cat.nombre}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
