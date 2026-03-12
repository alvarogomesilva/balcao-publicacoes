import { getErrorMessage } from "@/lib/errors";
import { customerValidation, type CustomerForm } from "@/validations/customer-validation";
import {
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../hooks/use-customers";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  customerId?: string;
  defaultValues?: CustomerForm;
}

const emptyValues: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  notes: "",
  active: true,
};

export function CustomerDialog({
  open,
  onOpenChange,
  mode,
  customerId,
  defaultValues = emptyValues,
}: CustomerDialogProps) {
  const createMutation = useCreateCustomerMutation();
  const updateMutation = useUpdateCustomerMutation();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerValidation),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  async function onSubmit(values: CustomerForm) {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (customerId) {
        await updateMutation.mutateAsync({ id: customerId, values });
      }

      onOpenChange(false);
      reset(emptyValues);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          mode === "create"
            ? "Nao foi possivel criar o cliente."
            : "Nao foi possivel atualizar o cliente.",
        ),
      );
    }
  }

  return (
    <Dialog.Root size="lg" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create" ? "Novo cliente" : "Editar cliente"}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Field.Root invalid={!!errors.name} mb={4}>
                <Field.Label>Nome</Field.Label>
                <Input {...register("name")} autoFocus />
                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email} mb={4}>
                <Field.Label>Email (opcional)</Field.Label>
                <Input type="email" placeholder="cliente@empresa.com" {...register("email")} />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.phone} mb={4}>
                <Field.Label>Telefone</Field.Label>
                <Input {...register("phone")} />
                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.city} mb={4}>
                <Field.Label>Cidade</Field.Label>
                <Input {...register("city")} />
                <Field.ErrorText>{errors.city?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.notes} mb={4}>
                <Field.Label>Observacoes</Field.Label>
                <Textarea minH="110px" {...register("notes")} />
                <Field.ErrorText>{errors.notes?.message}</Field.ErrorText>
              </Field.Root>

              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Checkbox.Root
                    checked={field.value}
                    onCheckedChange={(details) => field.onChange(details.checked)}
                    colorPalette="teal"
                    mb={5}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Cliente ativo</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />

              <Button type="submit" w="100%" bg="teal.600" color="white" loading={isSubmitting}>
                {mode === "create" ? "Cadastrar cliente" : "Salvar alteracoes"}
              </Button>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
