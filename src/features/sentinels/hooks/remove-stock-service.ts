import { registerStockMovement } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { StockMutationValues } from "@/features/publications/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveStock = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, quantity }: StockMutationValues) =>
      registerStockMovement("sentinels", { id, quantity }, "saida"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.sentinels.queryKey,
      });
      toast.success("Mensagem", {
        description: "Saída realizada com sucesso.",
      });
    },
  });

  return {
    removeStock: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
