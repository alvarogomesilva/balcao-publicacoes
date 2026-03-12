import { searchPublications } from "@/features/publications/api";

export const useSearchBook = () => {
  const searchBook = (search: string) => searchPublications("books", search);

  return { searchBook };
};
