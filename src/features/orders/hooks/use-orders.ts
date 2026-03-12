import { invalidateOperationalQueries } from "@/features/publications/hooks/use-publications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOrder, fetchOrders, fetchRecentOrders, updateOrderNotes, updateOrderStatus } from "../api";
import type { CreateOrderValues, Order, OrderStatus } from "../types";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
}

export function useRecentOrders(maxItems = 8) {
  return useQuery<Order[]>({
    queryKey: ["recent-orders", maxItems],
    queryFn: () => fetchRecentOrders(maxItems),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateOrderValues) => createOrder(values),
    onSuccess: async () => {
      await invalidateOperationalQueries(queryClient);
      toast.success("Sucesso", {
        description: "Pedido criado com sucesso.",
      });
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: async (_, variables) => {
      await invalidateOperationalQueries(queryClient);
      toast.success("Mensagem", {
        description: `Status atualizado para ${variables.status}.`,
      });
    },
  });
}

export function useUpdateOrderNotesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateOrderNotes(id, notes),
    onSuccess: async () => {
      await invalidateOperationalQueries(queryClient);
      toast.success("Mensagem", {
        description: "Observacoes atualizadas.",
      });
    },
  });
}
