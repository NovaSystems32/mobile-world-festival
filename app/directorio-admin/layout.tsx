import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Directorio — Mobile World Festival",
};

export default function DirectorioAdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
