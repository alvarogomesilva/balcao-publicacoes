import { Navbar } from "@/components/shared/nav-bar";
import { ModalRegisterSentinel } from "@/features/sentinels/components/modal-register-sentinel";
import { useGetAllSentinels } from "@/features/sentinels/hooks/get-all-sentinel-service";
import { Box, Button, Flex, Heading, Input, InputGroup, Menu, Portal, Spinner, Table, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

export function Sentinels() {
  const [isOpen, setIsOpen] = useState(false)
  const { sentinels, isLoading } = useGetAllSentinels()

  const isSearching = false
  const searchResults: any[] = []

  const dataToRender = isSearching ? searchResults : sentinels

  return (
    <>
      <Navbar />

      <ModalRegisterSentinel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <Box margin={6}>
        <Flex justifyContent={"space-between"} my={4}>
          <Heading mb={3}>Sentinelas</Heading>

          <Button bg={"teal.700"}

            onClick={() => setIsOpen(!isOpen)}
          >
            Adicionar
          </Button>
        </Flex>

        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "stretch", md: "center" }}
          gap={3}
          marginBottom={4}
        >
          <InputGroup flex="1" startElement={<LuSearch />}>
            <Input
              placeholder="Pesquisar"
            //value={searchQuery}
            //onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Button bg={"teal.600"}
          //onClick={handleSearchByName}
          >
            <FiSearch />
          </Button>
        </Flex>

        {isLoading && (
          <VStack colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Carregando...</Text>
          </VStack>
        )}

        {/* Tabela responsiva */}
        {!isLoading && (
          <Box overflowX="auto">
            <Table.Root size="sm" showColumnBorder>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Nome</Table.ColumnHeader>
                  <Table.ColumnHeader>Estoque</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dataToRender.map((item: any) => (
                  <Table.Row key={item.name}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.stock}</Table.Cell>
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

                              {/* <Menu.Item
                                        onClick={() => {
                                          setAddIsOpen(true)
                                          setActualStock({
                                            stock: parseInt(item.stock),
                                            id: item.id
                                          })
                                        }}
                                        value="enter">
                                        Entrada Estoque
                                      </Menu.Item> */}
                              {/*         
                                      <Menu.Item
                                        value="out"
                                        onClick={() => {
                                          setOutIsOpen(true)
                                          setActualStock({
                                            stock: parseInt(item.stock),
                                            id: item.id
                                          })
                                        }}
                                      >
                                        Saida Estoque
                                      </Menu.Item> */}

                              {/* <Menu.Item
                                        value="edit"
                                        onClick={() => {
                                          setIsUpdate(true)
                                          setValuesUpdate({ id: item.id, name: item.name })
                                        }}>Editar</Menu.Item>
         */}
                              {/* <Menu.Item
                                        onClick={() => {
                                          setIsDelete(true)
                                          setPublicationDeleteId(item.id)
                                        }}
                                        value="delete">
                                        Excluir
                                      </Menu.Item> */}

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
    </>
  )
}