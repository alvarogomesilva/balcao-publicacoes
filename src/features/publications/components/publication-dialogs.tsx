import { getErrorMessage } from "@/lib/errors";
import {
  registerPublicationValidation,
  type RegisterPublication,
} from "@/validations/register-publication-validation";
import {
  registerQuantityValidation,
  type RegisterQuantity,
} from "@/validations/register-quantity-validation";
import {
  updatePublicationValidation,
  type UpdatePublication,
} from "@/validations/update-publication-validation";
import {
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getPublicationConfig } from "../config";
import {
  useCreatePublicationMutation,
  useDeletePublicationMutation,
  useStockMovementMutation,
  useUpdatePublicationMutation,
} from "../hooks/use-publications";
import type { PublicationCollection } from "../types";

interface CreatePublicationDialogProps {
  collection: PublicationCollection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePublicationDialog({
  collection,
  open,
  onOpenChange,
}: CreatePublicationDialogProps) {
  const config = getPublicationConfig(collection);
  const createMutation = useCreatePublicationMutation(collection);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<RegisterPublication>({
    resolver: zodResolver(registerPublicationValidation),
    defaultValues: {
      active: true,
      name: "",
      code: "",
    },
  });

  async function onSubmit(values: RegisterPublication) {
    try {
      await createMutation.mutateAsync(values);
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        getErrorMessage(error, `Não foi possível cadastrar ${config.singularLabel}.`),
      );
    }
  }

  return (
    <Dialog.Root size="xs" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Cadastro de {config.singularLabel}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Checkbox.Root
                    checked={field.value}
                    onCheckedChange={(details) => field.onChange(details.checked)}
                    colorPalette="teal"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Publicação ativa</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />

              <Field.Root invalid={!!errors.name} marginY={4}>
                <Field.Label>Nome</Field.Label>
                <Input {...register("name")} autoFocus />
                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.code} marginY={4}>
                <Field.Label>Código</Field.Label>
                <Input {...register("code")} />
                <Field.ErrorText>{errors.code?.message}</Field.ErrorText>
              </Field.Root>

              <Button type="submit" w="100%" bg="green.600" loading={isSubmitting}>
                Cadastrar
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

interface UpdatePublicationDialogProps {
  collection: PublicationCollection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: {
    id: string;
    name: string;
  };
}

export function UpdatePublicationDialog({
  collection,
  open,
  onOpenChange,
  values,
}: UpdatePublicationDialogProps) {
  const config = getPublicationConfig(collection);
  const closeButton = useRef<HTMLButtonElement>(null);
  const updateMutation = useUpdatePublicationMutation(collection);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UpdatePublication>({
    resolver: zodResolver(updatePublicationValidation),
    defaultValues: values,
  });

  useEffect(() => {
    if (open) {
      reset(values);
    }
  }, [open, reset, values]);

  async function onSubmit(data: UpdatePublication) {
    try {
      await updateMutation.mutateAsync(data);
      closeButton.current?.click();
    } catch (error) {
      toast.error(
        getErrorMessage(error, `Não foi possível atualizar ${config.singularLabel}.`),
      );
    }
  }

  return (
    <Dialog.Root size="xs" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Atualizar publicação</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Field.Root invalid={!!errors.name} marginY={4}>
                <Field.Label>Nome</Field.Label>
                <Input autoFocus {...register("name")} />
                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>
              <Button type="submit" w="100%" bg="green.600" loading={isSubmitting}>
                Atualizar
              </Button>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" ref={closeButton} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

interface DeletePublicationDialogProps {
  collection: PublicationCollection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicationId: string;
}

export function DeletePublicationDialog({
  collection,
  open,
  onOpenChange,
  publicationId,
}: DeletePublicationDialogProps) {
  const config = getPublicationConfig(collection);
  const closeButton = useRef<HTMLButtonElement>(null);
  const deleteMutation = useDeletePublicationMutation(collection);

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(publicationId);
      closeButton.current?.click();
    } catch (error) {
      toast.error(
        getErrorMessage(error, `Não foi possível excluir ${config.singularLabel}.`),
      );
    }
  }

  return (
    <Dialog.Root role="dialog" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Deseja realmente excluir?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Essa operação remove {config.singularLabel.toLowerCase()} da listagem atual.
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette="red" onClick={handleDelete}>
                Excluir
              </Button>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild ref={closeButton}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

interface StockMovementDialogProps {
  collection: PublicationCollection;
  type: "entrada" | "saida";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicationId: string;
}

export function StockMovementDialog({
  collection,
  type,
  open,
  onOpenChange,
  publicationId,
}: StockMovementDialogProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const mutation = useStockMovementMutation(collection, type);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<RegisterQuantity>({
    resolver: zodResolver(registerQuantityValidation),
  });

  async function onSubmit(values: RegisterQuantity) {
    try {
      await mutation.mutateAsync({ id: publicationId, quantity: values.quantity });
      closeButton.current?.click();
      reset();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          type === "entrada"
            ? "Não foi possível adicionar ao estoque."
            : "Não foi possível retirar do estoque.",
        ),
      );
    }
  }

  return (
    <Dialog.Root size="xs" open={open} onOpenChange={(detail) => onOpenChange(detail.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {type === "entrada" ? "Adicionar ao estoque" : "Saída do estoque"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(onSubmit)}>
              <Field.Root invalid={!!errors.quantity} marginY={4}>
                <Field.Label>Quantidade</Field.Label>
                <Input
                  type="number"
                  autoFocus
                  {...register("quantity", { valueAsNumber: true })}
                />
                <Field.ErrorText>{errors.quantity?.message}</Field.ErrorText>
              </Field.Root>
              <Button type="submit" w="100%" bg="green.600" loading={isSubmitting}>
                {type === "entrada" ? "Adicionar" : "Remover"}
              </Button>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" ref={closeButton} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
