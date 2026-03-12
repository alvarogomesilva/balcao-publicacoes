import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Sentinels() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="sentinels"
        title="Sentinelas"
        description="Area dedicada aos titulos Sentinelas com visao operacional responsiva e busca rapida."
      />
    </>
  );
}
