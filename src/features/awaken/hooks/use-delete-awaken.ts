import { deletePublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteAwaken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePublication("awaken", id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.awaken.queryKey,
      });
      toast.success("Mensagem", {
        description: "Despertai excluído com sucesso.",
      });
    },
  });

  return {
    deleteAwaken: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
