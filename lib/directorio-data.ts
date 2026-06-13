export interface Empresa {
  slug: string;
  nombre: string;
  categoria: string;
  pais: string;
  descripcion: string;
  telefono?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  direccion?: string;
  logoColor: string;
  logoText: string;
  badge?: number;
  destacado?: boolean;
  premium?: boolean;
  patrocinado?: boolean;
  tags?: string[];
  catalogos?: { nombre: string; url: string }[];
}

export interface Categoria {
  slug: string;
  nombre: string;
  emoji: string;
  color: string;
  badge?: number;
}

export interface Pais {
  slug: string;
  nombre: string;
  bandera: string;
  codigo: string;
  color: string;
}

export const paises: Pais[] = [
  { slug: "argentina", nombre: "Argentina", bandera: "🇦🇷", codigo: "ar", color: "#74b9ff" },
  { slug: "bolivia", nombre: "Bolivia", bandera: "🇧🇴", codigo: "bo", color: "#fdcb6e" },
  { slug: "brasil", nombre: "Brasil", bandera: "🇧🇷", codigo: "br", color: "#00b894" },
  { slug: "chile", nombre: "Chile", bandera: "🇨🇱", codigo: "cl", color: "#d63031" },
  { slug: "china", nombre: "China", bandera: "🇨🇳", codigo: "cn", color: "#d63031" },
  { slug: "colombia", nombre: "Colombia", bandera: "🇨🇴", codigo: "co", color: "#fdcb6e" },
  { slug: "costarica", nombre: "Costa Rica", bandera: "🇨🇷", codigo: "cr", color: "#0984e3" },
  { slug: "cuba", nombre: "Cuba", bandera: "🇨🇺", codigo: "cu", color: "#0984e3" },
  { slug: "ecuador", nombre: "Ecuador", bandera: "🇪🇨", codigo: "ec", color: "#fdcb6e" },
  { slug: "elsalvador", nombre: "El Salvador", bandera: "🇸🇻", codigo: "sv", color: "#0984e3" },
  { slug: "guatemala", nombre: "Guatemala", bandera: "🇬🇹", codigo: "gt", color: "#00cec9" },
  { slug: "honduras", nombre: "Honduras", bandera: "🇭🇳", codigo: "hn", color: "#0984e3" },
  { slug: "mexico", nombre: "México", bandera: "🇲🇽", codigo: "mx", color: "#00b894" },
  { slug: "nicaragua", nombre: "Nicaragua", bandera: "🇳🇮", codigo: "ni", color: "#0984e3" },
  { slug: "panama", nombre: "Panamá", bandera: "🇵🇦", codigo: "pa", color: "#e17055" },
  { slug: "paraguay", nombre: "Paraguay", bandera: "🇵🇾", codigo: "py", color: "#d63031" },
  { slug: "peru", nombre: "Perú", bandera: "🇵🇪", codigo: "pe", color: "#d63031" },
  { slug: "puertorico", nombre: "Puerto Rico", bandera: "🇵🇷", codigo: "pr", color: "#e17055" },
  { slug: "repdom", nombre: "Rep. Dom.", bandera: "🇩🇴", codigo: "do", color: "#0984e3" },
  { slug: "uruguay", nombre: "Uruguay", bandera: "🇺🇾", codigo: "uy", color: "#74b9ff" },
  { slug: "venezuela", nombre: "Venezuela", bandera: "🇻🇪", codigo: "ve", color: "#d63031" },
];

export const categorias: Categoria[] = [
  { slug: "mayorista", nombre: "Mayorista", emoji: "🏭", color: "#636e72", badge: 0 },
  { slug: "minorista", nombre: "Minorista", emoji: "🛍️", color: "#00b894", badge: 0 },
  { slug: "distribuidor", nombre: "Distribuidor", emoji: "🚚", color: "#d63031", badge: 0 },
  { slug: "importador", nombre: "Importador", emoji: "🌐", color: "#e17055", badge: 0 },
  { slug: "comics", nombre: "Cómics", emoji: "💬", color: "#a29bfe", badge: 0 },
  { slug: "electronica", nombre: "Electrónica", emoji: "📱", color: "#00cec9", badge: 0 },
  { slug: "accesorios", nombre: "Accesorios", emoji: "🎧", color: "#e17055", badge: 0 },
  { slug: "gaming", nombre: "Gaming", emoji: "🎮", color: "#2d3436", badge: 0 },
  { slug: "tablets", nombre: "Tablets", emoji: "💻", color: "#00b894", badge: 0 },
  { slug: "audio", nombre: "Audio", emoji: "🔊", color: "#00b894", badge: 0 },
  { slug: "cables", nombre: "Cables", emoji: "🔌", color: "#795548", badge: 0 },
  { slug: "ofertas", nombre: "Ofertas", emoji: "🏷️", color: "#e91e8c", badge: 0 },
  { slug: "redes", nombre: "Redes", emoji: "📡", color: "#0984e3", badge: 0 },
  { slug: "seguridad", nombre: "Seguridad", emoji: "🔒", color: "#636e72", badge: 0 },
  { slug: "smartwatch", nombre: "Smartwatch", emoji: "⌚", color: "#795548", badge: 0 },
  { slug: "novedades", nombre: "Novedades", emoji: "✨", color: "#e17055", badge: 0 },
  { slug: "archivos", nombre: "Archivos", emoji: "📁", color: "#0984e3", badge: 0 },
  { slug: "mensajes", nombre: "Mensajes", emoji: "✉️", color: "#00b894", badge: 0 },
  { slug: "soporte", nombre: "Soporte", emoji: "🔧", color: "#e17055", badge: 0 },
  { slug: "config", nombre: "Config", emoji: "⚙️", color: "#636e72", badge: 0 },
];

export const empresas: Empresa[] = [];

export function getPais(slug: string): Pais | undefined {
  return paises.find((p) => p.slug === slug);
}

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export function getEmpresasByPaisAndCategoria(pais: string, categoria: string): Empresa[] {
  return empresas.filter((e) => e.pais === pais && e.categoria === categoria);
}

export function getEmpresa(pais: string, categoria: string, slug: string): Empresa | undefined {
  return empresas.find((e) => e.pais === pais && e.categoria === categoria && e.slug === slug);
}

export function getCategoriasConEmpresas(pais: string): Categoria[] {
  const cats = new Set(empresas.filter((e) => e.pais === pais).map((e) => e.categoria));
  return categorias.filter((c) => cats.has(c.slug));
}
