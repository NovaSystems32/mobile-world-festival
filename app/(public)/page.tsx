import Hero from "@/components/public/Hero";
import BenefitsSection from "@/components/public/BenefitsSection";
import ProductCatalog from "@/components/public/ProductCatalog";
import WholesaleSection from "@/components/public/WholesaleSection";
import AboutSection from "@/components/public/AboutSection";
import TrustSection from "@/components/public/TrustSection";
import ContactSection from "@/components/public/ContactSection";
import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Hero />
      <BenefitsSection />
      <ProductCatalog products={products} categories={categories} />
      <WholesaleSection />
      <AboutSection />
      <TrustSection />
      <ContactSection />
    </>
  );
}
