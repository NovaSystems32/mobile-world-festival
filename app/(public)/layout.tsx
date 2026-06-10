import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import CartDrawer from "@/components/public/CartDrawer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
