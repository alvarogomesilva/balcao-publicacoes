import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Others() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="others"
        title="Outras publicacoes"
        description="Espaco para materiais complementares, itens sazonais e publicacoes fora das linhas principais."
      />
    </>
  );
}
