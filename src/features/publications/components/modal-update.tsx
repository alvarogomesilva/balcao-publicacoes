import { Button, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useUpdatePublication } from "../hooks/use-update";
import type { UpdatePublication } from "@/validations/update-publication-validation";
import { useGetAllPublications } from "../hooks/use-get-all";

interface ValuesProps {
    id: string
    name: string
}

interface ModalProps {
    isUpdate: boolean;
    setIsUpdate: (detail: any) => void;
    values: ValuesProps;
    refecth: () => void
}

export function ModalUpdatePublication({ isUpdate, setIsUpdate, values, refecth }: ModalProps) {
    const {  } = useGetAllPublications()
    const closeButton = useRef<HTMLButtonElement>(null)
    const { updatePublication } = useUpdatePublication()
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdatePublication>({
        defaultValues: {
            id: values.id,
            name: values.name,
        },
    });

    // 🔄 Atualiza os valores do form quando `values` mudar
    useEffect(() => {
        if (isUpdate) {
            reset(values);
        }
    }, [values, isUpdate, reset]);

    async function handleUpdatePublication(data: UpdatePublication) {
        await updatePublication(data)
        closeButton.current?.click()
        refecth()
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
                        <Dialog.Body
                            pb="8"
                            as="form"
                            onSubmit={handleSubmit(handleUpdatePublication)}
                        >
                            <Field.Root marginY={4}>
                                <Field.Label>Nome</Field.Label>
                                <Input
                                    autoFocus
                                    {...register("name")}
                                />
                            </Field.Root>
                            <Button
                                type="submit"
                                w="100%"
                                bg="green.600"
                                loading={isSubmitting}
                            >
                                Atualizar
                            </Button>
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" ref={closeButton}/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
