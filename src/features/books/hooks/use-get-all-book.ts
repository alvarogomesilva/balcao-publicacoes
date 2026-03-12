import { fetchPublications } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { Publication } from "@/features/publications/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllBooks = () => {
  const { data: books = [], isLoading, isError } = useQuery<Publication[]>({
    queryKey: publicationConfigs.books.queryKey,
    queryFn: () => fetchPublications("books"),
  });

  return { books, isLoading, isError };
};
