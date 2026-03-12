import { registerStockMovement } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { StockMutationValues } from "@/features/publications/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddStock = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, quantity }: StockMutationValues) =>
      registerStockMovement("awaken", { id, quantity }, "entrada"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.awaken.queryKey,
      });
      toast.success("Mensagem", {
        description: "Estoque atualizado com sucesso.",
      });
    },
  });

  return {
    addStock: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
