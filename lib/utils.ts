export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getStockStatus(stock: number, lowAlert: number = 3) {
  if (stock === 0) return { label: "Sin stock", color: "red" } as const;
  if (stock <= lowAlert) return { label: "Stock bajo", color: "yellow" } as const;
  return { label: "Disponible", color: "green" } as const;
}

export const WHATSAPP_NUMBER = "5493512373751";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
