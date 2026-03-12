import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Books() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="books"
        title="Livros"
        description="Catálogo principal de livros com controle rápido de estoque, atualização e busca por título."
      />
    </>
  );
}
