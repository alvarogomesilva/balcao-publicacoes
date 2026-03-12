import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCustomer, fetchCustomers, toggleCustomerActive, updateCustomer } from "../api";
import type { Customer, CustomerFormValues } from "../types";
import { invalidateOperationalQueries } from "@/features/publications/hooks/use-publications";

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CustomerFormValues) => createCustomer(values),
    onSuccess: async () => {
      await invalidateOperationalQueries(queryClient);
      toast.success("Sucesso", {
        description: "Cliente criado com sucesso.",
      });
    },
  });
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      updateCustomer(id, values),
    onSuccess: async () => {
      await invalidateOperationalQueries(queryClient);
      toast.success("Sucesso", {
        description: "Cliente atualizado com sucesso.",
      });
    },
  });
}

export function useToggleCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleCustomerActive(id, active),
    onSuccess: async (_, variables) => {
      await invalidateOperationalQueries(queryClient);
      toast.success("Mensagem", {
        description: variables.active
          ? "Cliente reativado com sucesso."
          : "Cliente desativado com sucesso.",
      });
    },
  });
}
