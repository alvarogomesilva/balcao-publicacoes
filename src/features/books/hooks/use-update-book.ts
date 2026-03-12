import { updatePublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdatePublication } from "@/validations/update-publication-validation";

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: UpdatePublication) => updatePublication("books", values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.books.queryKey,
      });
      toast.success("Sucesso", {
        description: "Livro atualizado com sucesso.",
      });
    },
  });

  return {
    updateBook: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
