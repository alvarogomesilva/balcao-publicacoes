import { getErrorMessage } from "@/lib/errors";
import {
  registerQuantityValidation,
  type RegisterQuantity,
} from "@/validations/register-quantity-validation";
import { Button, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAddStock } from "../hooks/use-add-stock";

interface StockUpdate {
  id: string;
  stock: number;
}

interface ModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  actualStock: StockUpdate;
}

export function ModalAddStockBook({ open, setIsOpen, actualStock }: ModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const { addStock } = useAddStock();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<RegisterQuantity>({
    resolver: zodResolver(registerQuantityValidation),
  });

  async function handleRegisterQuantity(data: RegisterQuantity) {
    try {
      await addStock({ id: actualStock.id, quantity: data.quantity });
      closeButton.current?.click();
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível adicionar ao estoque."));
    }
  }

  return (
    <Dialog.Root
      size="xs"
      open={open}
      onOpenChange={(detail) => setIsOpen(detail.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Adicionar ao estoque</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(handleRegisterQuantity)}>
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
                Adicionar
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
