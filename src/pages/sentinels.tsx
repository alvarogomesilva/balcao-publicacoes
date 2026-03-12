import { Navbar } from "@/components/shared/nav-bar";
import { CatalogPage } from "@/features/publications/components/catalog-page";

export function Sentinels() {
  return (
    <>
      <Navbar />
      <CatalogPage
        collection="sentinels"
        title="Sentinelas"
        description="Área dedicada aos títulos Sentinelas com visão operacional responsiva e busca rápida."
      />
    </>
  );
}
