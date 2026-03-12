import { getErrorMessage } from "@/lib/errors";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useRef } from "react";
import { toast } from "sonner";
import { useDeleteAwaken } from "../hooks/use-delete-awaken";

interface ModalProps {
  isDelete: boolean;
  setIsDelete: (open: boolean) => void;
  publicationDeleteId: string;
}

export function ModalDeleteAwaken({
  isDelete,
  setIsDelete,
  publicationDeleteId,
}: ModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const { deleteAwaken } = useDeleteAwaken();

  async function handleDeletePublication(id: string) {
    try {
      await deleteAwaken(id);
      closeButton.current?.click();
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível excluir o despertai."));
    }
  }

  return (
    <Dialog.Root
      role="dialog"
      open={isDelete}
      onOpenChange={(detail) => setIsDelete(detail.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Deseja realmente excluir?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>Essa operação não pode ser desfeita.</p>
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
  );
}
