import { deletePublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePublication("books", id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.books.queryKey,
      });
      toast.success("Mensagem", {
        description: "Livro excluído com sucesso.",
      });
    },
  });

  return {
    deleteBook: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
