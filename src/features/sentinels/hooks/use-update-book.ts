import { updatePublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UpdatePublication } from "@/validations/update-publication-validation";

export const useUpdateSentinel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: UpdatePublication) => updatePublication("sentinels", values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.sentinels.queryKey,
      });
      toast.success("Sucesso", {
        description: "Sentinela atualizado com sucesso.",
      });
    },
  });

  return {
    updateSentinel: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
