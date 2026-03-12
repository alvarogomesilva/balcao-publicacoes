import { createPublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (inputs: RegisterPublication) => createPublication("books", inputs),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.books.queryKey,
      });
      toast.success("Sucesso", {
        description: "Livro criado com sucesso.",
      });
    },
  });

  return {
    registerBook: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
