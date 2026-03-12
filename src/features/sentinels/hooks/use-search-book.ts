import { searchPublications } from "@/features/publications/api";

export const useSearchSentinel = () => {
  const searchSentinel = (search: string) => searchPublications("sentinels", search);

  return { searchSentinel };
};
