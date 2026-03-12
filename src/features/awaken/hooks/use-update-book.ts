import { updatePublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdatePublication } from "@/validations/update-publication-validation";

export const useUpdateAwaken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: UpdatePublication) => updatePublication("awaken", values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.awaken.queryKey,
      });
      toast.success("Sucesso", {
        description: "Despertai atualizado com sucesso.",
      });
    },
  });

  return {
    updateAwaken: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
