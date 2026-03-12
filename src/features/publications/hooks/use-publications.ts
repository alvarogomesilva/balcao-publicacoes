import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPublication,
  deletePublication,
  fetchDashboardSummary,
  fetchPublications,
  fetchRecentMovements,
  registerStockMovement,
  searchPublications,
  updatePublication,
} from "../api";
import { getPublicationConfig } from "../config";
import type {
  DashboardSummary,
  Movement,
  Publication,
  PublicationCollection,
  StockMutationValues,
} from "../types";
import type { RegisterPublication } from "@/validations/register-publication-validation";
import type { UpdatePublication } from "@/validations/update-publication-validation";

export function usePublications(collection: PublicationCollection) {
  const config = getPublicationConfig(collection);

  return useQuery<Publication[]>({
    queryKey: config.queryKey,
    queryFn: () => fetchPublications(collection),
  });
}

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
  });
}

export function useRecentMovements(maxItems = 24) {
  return useQuery<Movement[]>({
    queryKey: ["recent-movements", maxItems],
    queryFn: () => fetchRecentMovements(maxItems),
  });
}

export function usePublicationSearch(collection: PublicationCollection) {
  return {
    searchPublications: (search: string) => searchPublications(collection, search),
  };
}

function invalidateCatalogQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  collection: PublicationCollection,
) {
  const config = getPublicationConfig(collection);

  return Promise.all([
    queryClient.invalidateQueries({ queryKey: config.queryKey }),
    queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] }),
    queryClient.invalidateQueries({ queryKey: ["recent-movements"] }),
  ]);
}

export function useCreatePublicationMutation(collection: PublicationCollection) {
  const queryClient = useQueryClient();
  const config = getPublicationConfig(collection);

  return useMutation({
    mutationFn: (values: RegisterPublication) => createPublication(collection, values),
    onSuccess: async () => {
      await invalidateCatalogQueries(queryClient, collection);
      toast.success("Sucesso", {
        description: `${config.singularLabel} criado com sucesso.`,
      });
    },
  });
}

export function useUpdatePublicationMutation(collection: PublicationCollection) {
  const queryClient = useQueryClient();
  const config = getPublicationConfig(collection);

  return useMutation({
    mutationFn: (values: UpdatePublication) => updatePublication(collection, values),
    onSuccess: async () => {
      await invalidateCatalogQueries(queryClient, collection);
      toast.success("Sucesso", {
        description: `${config.singularLabel} atualizado com sucesso.`,
      });
    },
  });
}

export function useDeletePublicationMutation(collection: PublicationCollection) {
  const queryClient = useQueryClient();
  const config = getPublicationConfig(collection);

  return useMutation({
    mutationFn: (id: string) => deletePublication(collection, id),
    onSuccess: async () => {
      await invalidateCatalogQueries(queryClient, collection);
      toast.success("Mensagem", {
        description: `${config.singularLabel} excluído com sucesso.`,
      });
    },
  });
}

export function useStockMovementMutation(
  collection: PublicationCollection,
  type: "entrada" | "saida",
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: StockMutationValues) =>
      registerStockMovement(collection, { id, quantity }, type),
    onSuccess: async () => {
      await invalidateCatalogQueries(queryClient, collection);
      toast.success("Mensagem", {
        description:
          type === "entrada"
            ? "Estoque atualizado com sucesso."
            : "Saída realizada com sucesso.",
      });
    },
  });
}
