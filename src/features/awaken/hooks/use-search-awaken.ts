import { searchPublications } from "@/features/publications/api";

export const useSearchAwaken = () => {
  const searchAwaken = (search: string) => searchPublications("awaken", search);

  return { searchAwaken };
};
