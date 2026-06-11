import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/products";
import ProductModal from "@/components/public/ProductModal";
import ProductDetail from "@/components/public/ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
