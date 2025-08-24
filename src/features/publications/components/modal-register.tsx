import { registerPublicationValidation, type RegisterPublication } from "@/validations/register-publication-validation";
import { Button, Checkbox, CloseButton, createListCollection, Dialog, Field, Input, Portal, Select } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRegister } from "../hooks/use-register";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (detail: any) => void;
    refecth: () => void;
}

export function ModalRegisterPublication({ isOpen, setIsOpen, refecth }: ModalProps) {
    const { registerPublication } = useRegister();
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

    async function handleRegisterPublication(data: RegisterPublication) {
        //console.log("FORM DATA:", data);
        await registerPublication(data);
        reset({
            name: "",
            code: ""
        });
        setIsOpen(false);
        refecth();
    }

    const listTypePublications = createListCollection({
        items: [
            { label: "Livros", value: "livros" },
            { label: "Sentinela", value: "sentinelas" },
            { label: "Despertai", value: "despertais" },
            { label: "Outros", value: "outros" },
        ],
    });

    return (
        <Dialog.Root size="xs" open={isOpen} onOpenChange={(detail) => setIsOpen(detail.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Cadastro de publicação</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb="8" as="form" onSubmit={handleSubmit(handleRegisterPublication)}>

                            <Controller
                                control={control}
                                name="active"
                                render={({ field }) => (
                                    <Checkbox.Root
                                        checked={field.value}
                                        onCheckedChange={(details) => field.onChange(details.checked)} // 👈 pega o objeto certo
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


                            <Field.Root invalid={!!errors.category}>
                                <Select.Root
                                    collection={listTypePublications}
                                    width="337px"
                                    {...register('category')}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Label>Categoria</Select.Label>
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Selecione um tipo" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>

                                    <Select.Positioner>
                                        <Select.Content>
                                            {listTypePublications.items.map((type) => (
                                                <Select.Item item={type} key={type.value}>
                                                    {type.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Select.Root>
                                <Field.ErrorText>{errors.category?.message}</Field.ErrorText>
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
