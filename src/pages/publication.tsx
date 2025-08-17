import { Navbar } from "@/components/shared/nav-bar"
import { useGetAllPublications } from "@/features/publications/hooks/use-get-all"
import { useRegister } from "@/features/publications/hooks/use-register"
import type { RegisterPublication } from "@/validations/register-publication-validation"
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  InputGroup,
  Portal,
  Spinner,
  Table
} from "@chakra-ui/react"
import { Menu } from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { LuSearch } from "react-icons/lu"

export function Publication() {
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<RegisterPublication>()
  const { registerPublication } = useRegister()
  const { publications, isLoading } = useGetAllPublications()


  const [isUpdate, setIsUpdate] = useState(false)
  const [valuesUpdates, setValuesUpdate] = useState({
    name: ""
  })

  async function handleRegisterPublication(data: RegisterPublication) {
    await registerPublication(data)
    reset()
    setIsOpen(false)
  }



  return (
    <>
      <Navbar />

      {/* Overlay de loading */}
      {isLoading && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          align="center"
          justify="center"
          bg="rgba(255,255,255,0.7)"
          zIndex="9999"
        >
          <Spinner size="xl" color="teal.500" />
        </Flex>
      )}

      <Box margin={6}>
        {/* Barra de pesquisa e botão responsivo */}
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "center" }}
          gap={3}
          marginBottom={4}
        >
          <InputGroup flex="1" startElement={<LuSearch />}>
            <Input placeholder="Pesquisar" />
          </InputGroup>

          <Button bg={"green.600"} onClick={() => setIsOpen(true)}>
            Adicionar
          </Button>
        </Flex>

        {/* Tabela responsiva */}
        {!isLoading && (
          <Box overflowX="auto">
            <Table.Root size="sm" showColumnBorder>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Code</Table.ColumnHeader>
                  <Table.ColumnHeader>Nome</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {publications.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.code}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Menu.Root>
                        <Menu.Trigger asChild>
                          <Button variant="outline" size="sm">
                            Opções
                          </Button>
                        </Menu.Trigger>
                        <Portal>
                          <Menu.Positioner>
                            <Menu.Content>
                              <Menu.Item value="edit" onClick={() => {
                                setIsUpdate(true)
                                setValuesUpdate({ name: item.name })
                              }}>Editar</Menu.Item>
                              <Menu.Item value="delete">Excluir</Menu.Item>
                            </Menu.Content>
                          </Menu.Positioner>
                        </Portal>
                      </Menu.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Box>

      {/* Modal de cadastro */}
      <Dialog.Root size={"xs"} open={isOpen} onOpenChange={(detail) => setIsOpen(detail.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Cadastro de publicação</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="8" as={"form"} onSubmit={handleSubmit(handleRegisterPublication)}>
                <Field.Root marginY={4}>
                  <Field.Label>Nome</Field.Label>
                  <Input {...register("name")} />
                </Field.Root>
                <Field.Root marginY={4}>
                  <Field.Label>Código</Field.Label>
                  <Input {...register("code")} />
                </Field.Root>

                <Button
                  type="submit"
                  w={"100%"}
                  bg={"green.600"}
                  loading={isSubmitting}
                >
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

      {isUpdate && (
        <Dialog.Root size={"xs"} open={isUpdate} onOpenChange={(detail) => setIsUpdate(detail.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Atualizar publicação</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="8" as={"form"} onSubmit={handleSubmit(handleRegisterPublication)}>
                <Field.Root marginY={4}>
                  <Field.Label>Nome</Field.Label>
                  <Input
                    value={valuesUpdates.name}
                    onChange={(e) => setValuesUpdate({ ...valuesUpdates, name: e.target.value })}
                  />
                </Field.Root>
                <Button
                  type="submit"
                  w={"100%"}
                  bg={"green.600"}
                  loading={isSubmitting}
                >
                  Atualizar
                </Button>
              </Dialog.Body>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      )}
    </>
  )
}
