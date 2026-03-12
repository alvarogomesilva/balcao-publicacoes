import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Others() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="others"
        title="Outras publicações"
        description="Espaço para materiais complementares, itens sazonais e publicações fora das linhas principais."
      />
    </>
  );
}
