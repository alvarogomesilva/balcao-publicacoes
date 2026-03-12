import { getErrorMessage } from "@/lib/errors";
import {
  updatePublicationValidation,
  type UpdatePublication,
} from "@/validations/update-publication-validation";
import { Button, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateSentinel } from "../hooks/use-update-book";

interface ValuesProps {
  id: string;
  name: string;
}

interface ModalProps {
  isUpdate: boolean;
  setIsUpdate: (open: boolean) => void;
  values: ValuesProps;
}

export function ModalUpdateBook({ isUpdate, setIsUpdate, values }: ModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const { updateSentinel } = useUpdateSentinel();
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
    if (isUpdate) {
      reset(values);
    }
  }, [values, isUpdate, reset]);

  async function handleUpdatePublication(data: UpdatePublication) {
    try {
      await updateSentinel(data);
      closeButton.current?.click();
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível atualizar o sentinela."));
    }
  }

  return (
    <Dialog.Root
      size="xs"
      open={isUpdate}
      onOpenChange={(detail) => setIsUpdate(detail.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Atualizar publicação</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(handleUpdatePublication)}>
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
