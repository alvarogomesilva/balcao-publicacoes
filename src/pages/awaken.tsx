import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Awaken() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="awaken"
        title="Despertais"
        description="Gerencie os títulos da linha Despertai com a mesma operação de cadastro, ajuste e estoque."
      />
    </>
  );
}
