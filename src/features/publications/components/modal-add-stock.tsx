import { registerQuantityValidation, type RegisterQuantity } from "@/validations/register-quantity-validation";
import { Button, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddStock } from "../hooks/use-add-stock";
import { useRef } from "react";

interface StockUpdate {
    id: string
    stock: number
}

interface ModalProps {
    open: boolean
    setIsOpen: (open: boolean) => void
    actualStock: StockUpdate
    refecth: () => void
}

export function ModalAddStock({ open, setIsOpen, actualStock, refecth }: ModalProps) {
    const closeButton = useRef<HTMLButtonElement>(null)
    const { addStock } = useAddStock()
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<RegisterQuantity>({
        resolver: zodResolver(registerQuantityValidation),
       
    })

    async function handleRegisterQuantity(data: RegisterQuantity) {
        await addStock(actualStock.id, actualStock.stock, data.quantity)
        closeButton.current?.click()
        reset()
        refecth()
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
                            <Dialog.Title>Adicionar ao Estoque</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            pb="8"
                            as="form"
                            onSubmit={handleSubmit(handleRegisterQuantity)}
                        >
                            <Field.Root marginY={4}>
                                <Field.Label>Quantidade</Field.Label>
                                <Input
                                    type="number"
                                    autoFocus
                                    {...register("quantity", { valueAsNumber: true })}
                                />
                            </Field.Root>
                            <Button
                                type="submit"
                                w="100%"
                                bg="green.600"
                                loading={isSubmitting}
                            >
                                Adicionar
                            </Button>
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm"
                            ref={closeButton}

                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}