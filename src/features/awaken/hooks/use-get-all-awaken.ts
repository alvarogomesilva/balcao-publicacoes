import { fetchPublications } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { Publication } from "@/features/publications/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAwaken = () => {
  const { data: awaken = [], isLoading, isError } = useQuery<Publication[]>({
    queryKey: publicationConfigs.awaken.queryKey,
    queryFn: () => fetchPublications("awaken"),
  });

  return { awaken, isLoading, isError };
};
