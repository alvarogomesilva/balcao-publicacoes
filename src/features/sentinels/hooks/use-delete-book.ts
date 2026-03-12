import { deletePublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteSentinel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deletePublication("sentinels", id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.sentinels.queryKey,
      });
      toast.success("Mensagem", {
        description: "Sentinela excluído com sucesso.",
      });
    },
  });

  return {
    deleteSentinel: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
