// ... imports iguais

import { Navbar } from "@/components/shared/nav-bar"
import { ModalAddStock } from "@/features/publications/components/modal-add-stock"
import { ModalDeletePulication } from "@/features/publications/components/modal-delete"
import { ModalOutStock } from "@/features/publications/components/modal-out-stock"
import { ModalRegisterPublication } from "@/features/publications/components/modal-register"
import { ModalUpdatePublication } from "@/features/publications/components/modal-update"
import { useGetAllPublications } from "@/features/publications/hooks/use-get-all"
import { useSearch } from "@/features/publications/hooks/use-search"
import { Box, Button, Flex, Heading, Input, InputGroup, Menu, Portal, Table } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { LuSearch } from "react-icons/lu"
import { FiSearch } from "react-icons/fi";

export function Publication() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const [addIsOpen, setAddIsOpen] = useState(false)
  const [outIsOpen, setOutIsOpen] = useState(false)
  const [actualStock, setActualStock] = useState({
    stock: 0,
    id: ""
  })

  const [publicationDeleteId, setPublicationDeleteId] = useState("")
  const { publications, isLoading, getAllPublications } = useGetAllPublications()

  const [valuesUpdates, setValuesUpdate] = useState({
    id: "",
    name: ""
  })

  const { search } = useSearch()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([]) // resultados da busca
  const [isSearching, setIsSearching] = useState(false) // flag para indicar se está buscando

  async function handleSearchByName() {
    if (!searchQuery.trim()) {
      // se campo vazio, volta para lista padrão
      setIsSearching(false)
      return
    }

    const q = await search(searchQuery)

    if (q) {
      setSearchResults(q)
      setIsSearching(true) // mostra resultados
    }
  }

  useEffect(() => {
    getAllPublications()
  }, [])

  // decide qual lista renderizar
  const dataToRender = isSearching ? searchResults : publications

  return (
    <>
      <Navbar />

      <Box margin={6}>
        <Flex justifyContent={"space-between"} my={4}>
          <Heading mb={3}>Publicações</Heading>

          <Button bg={"teal.700"} onClick={() => setIsOpen(true)}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Button bg={"teal.600"} onClick={handleSearchByName}>
            <FiSearch />
          </Button>
        </Flex>

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

                              <Menu.Item
                                onClick={() => {
                                  setAddIsOpen(true)
                                  setActualStock({
                                    stock: parseInt(item.stock),
                                    id: item.id
                                  })
                                }}
                                value="enter">
                                Entrada Estoque
                              </Menu.Item>

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
                              </Menu.Item>

                              <Menu.Item
                                value="edit"
                                onClick={() => {
                                  setIsUpdate(true)
                                  setValuesUpdate({ id: item.id, name: item.name })
                                }}>Editar</Menu.Item>

                              <Menu.Item
                                onClick={() => {
                                  setIsDelete(true)
                                  setPublicationDeleteId(item.id)
                                }}
                                value="delete">
                                Excluir
                              </Menu.Item>
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

      {/* Modais */}
      <ModalRegisterPublication
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refecth={getAllPublications}
      />

      <ModalUpdatePublication
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        values={valuesUpdates}
        refecth={getAllPublications}
      />

      <ModalDeletePulication
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        publicationDeleteId={publicationDeleteId}
        refecth={getAllPublications}
      />

      <ModalAddStock
        setIsOpen={setAddIsOpen}
        open={addIsOpen}
        actualStock={actualStock}
        refecth={getAllPublications}
      />

      <ModalOutStock
        setIsOpen={setOutIsOpen}
        open={outIsOpen}
        actualStock={actualStock}
        refecth={getAllPublications}
      />
    </>
  )
}
