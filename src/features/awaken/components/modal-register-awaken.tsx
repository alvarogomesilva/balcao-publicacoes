import { registerPublicationValidation, type RegisterPublication } from "@/validations/register-publication-validation";
import { Button, Checkbox, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRegisterAwaken } from "../hooks/use-register-awaken";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (detail: any) => void;
    
}

export function ModalRegisterAwaken({ isOpen, setIsOpen }: ModalProps) {
    const { registerAwaken } = useRegisterAwaken()
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { isSubmitting, errors },
    } = useForm<RegisterPublication>({
        resolver: zodResolver(registerPublicationValidation),
        defaultValues: {
            active: true
        }
    });

    async function handleRegisterAwaken(data: RegisterPublication) {
        registerAwaken(data);
        reset({
            name: "",
            code: ""
        });
        setIsOpen(false);
      
    }

    return (
        <Dialog.Root size="xs" open={isOpen} onOpenChange={(detail) => setIsOpen(detail.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Cadastro de Despertai</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(handleRegisterAwaken)}>

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
                                        <Checkbox.Label>Publicação Ativa</Checkbox.Label>
                                    </Checkbox.Root>
                                )}
                            />

                            <Field.Root invalid={!!errors.name} marginY={4} >
                                <Field.Label>Nome</Field.Label>
                                <Input {...register("name")} autoFocus={true} />
                                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root marginY={4}>
                                <Field.Label>Código</Field.Label>
                                <Input {...register("code")} />
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
