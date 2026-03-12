import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Awaken() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="awaken"
        title="Despertais"
        description="Gerencie os titulos da linha Despertai com a mesma operacao de cadastro, ajuste e estoque."
      />
    </>
  );
}
