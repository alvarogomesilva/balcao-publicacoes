import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useDeletePublication } from "../hooks/use-delete"
import { useRef } from "react"


interface ModalProps {
    isDelete: boolean
    setIsDelete: (detail: any) => void
    publicationDeleteId: string
    refecth: () => void
}

export function ModalDeletePulication({ isDelete, setIsDelete, publicationDeleteId, refecth }: ModalProps) {
    const closeButton = useRef<HTMLButtonElement>(null)
    const { deletePublication } = useDeletePublication()

    async function handleDeletePublication(id: string) {
        await deletePublication(id)
        closeButton.current?.click()
        refecth()
    }

    return (
        <Dialog.Root role="dialog" open={isDelete} onOpenChange={(detail) => setIsDelete(detail.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Deseja realmente excluir?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                Essa operação não pode ser desfeita.
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                colorPalette="red"
                                onClick={() => handleDeletePublication(publicationDeleteId)}
                            >
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
    )
}