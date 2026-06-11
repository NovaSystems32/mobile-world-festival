import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/actions/products";
import ProductDetail from "@/components/public/ProductDetail";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
