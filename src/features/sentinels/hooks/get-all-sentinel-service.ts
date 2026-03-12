import { fetchPublications } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { Publication } from "@/features/publications/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSentinels = () => {
  const { data: sentinels = [], isLoading, isError } = useQuery<Publication[]>({
    queryKey: publicationConfigs.sentinels.queryKey,
    queryFn: () => fetchPublications("sentinels"),
  });

  return { sentinels, isLoading, isError };
};
