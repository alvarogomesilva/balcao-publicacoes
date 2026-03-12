import { createPublication } from "@/features/publications/api";
import { publicationConfigs } from "@/features/publications/config";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterAwaken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (inputs: RegisterPublication) => createPublication("awaken", inputs),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: publicationConfigs.awaken.queryKey,
      });
      toast.success("Sucesso", {
        description: "Despertai criado com sucesso.",
      });
    },
  });

  return {
    registerAwaken: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
