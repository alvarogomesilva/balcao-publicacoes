import { createPublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterSentinel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (inputs: RegisterPublication) => createPublication("sentinels", inputs),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.sentinels.queryKey,
      });
      toast.success("Sucesso", {
        description: "Sentinela criado com sucesso.",
      });
    },
  });

  return {
    registerSentinel: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
