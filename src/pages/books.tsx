import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Books() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="books"
        title="Livros"
        description="Catalogo principal de livros com controle rapido de estoque, atualizacao e busca por titulo."
      />
    </>
  );
}
