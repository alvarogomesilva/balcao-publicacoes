import { getErrorMessage } from "@/lib/errors";
import {
  registerPublicationValidation,
  type RegisterPublication,
} from "@/validations/register-publication-validation";
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
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRegisterBook } from "../hooks/use-register-book";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ModalRegisterBook({ isOpen, setIsOpen }: ModalProps) {
  const { registerBook } = useRegisterBook();
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

  async function handleRegisterBook(data: RegisterPublication) {
    try {
      await registerBook(data);
      reset();
      setIsOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível cadastrar o livro."));
    }
  }

  return (
    <Dialog.Root
      size="xs"
      open={isOpen}
      onOpenChange={(detail) => setIsOpen(detail.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Cadastro de Livro</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(handleRegisterBook)}>
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
