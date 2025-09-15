import { Navbar } from "@/components/shared/nav-bar"
import { Box, Button, Flex, Heading, Input, InputGroup, Menu, Portal, Table } from "@chakra-ui/react"
import { useState } from "react"
import { LuSearch } from "react-icons/lu"
import { FiSearch } from "react-icons/fi";
import { ModalRegisterBook } from "@/features/books/components/modal-register-book"
import { ModalUpdateBook } from "@/features/books/components/modal-update-book"
import { ModalDeleteBook } from "@/features/books/components/modal-delete-book"
import { ModalAddStockBook } from "@/features/books/components/modal-add-stock-book"
import { ModalOutStockBook } from "@/features/books/components/modal-out-stock-book"
import { useGetAllBooks } from "@/features/books/hooks/use-get-all-book"
import { useSearchBook } from "@/features/books/hooks/use-search-book"

export function Books() {
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
  const { books, isLoading } = useGetAllBooks()

  const [valuesUpdates, setValuesUpdate] = useState({
    id: "",
    name: ""
  })

  const { searchBook } = useSearchBook()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  async function handleSearchByName() {
    if (!searchQuery.trim()) {

      setIsSearching(false)
      return
    }

    const q = await searchBook(searchQuery)

    if (q) {
      setSearchResults(q)
      setIsSearching(true)
    }
  }

  // decide qual lista renderizar
  const dataToRender = isSearching ? searchResults : books

  return (
    <>
      <Navbar />

      <Box margin={6}>
        <Flex justifyContent={"space-between"} my={4}>
          <Heading mb={3}>Livros</Heading>

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
      <ModalRegisterBook
        isOpen={isOpen}
        setIsOpen={setIsOpen}

      />

      <ModalUpdateBook
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        values={valuesUpdates}

      />

      <ModalDeleteBook
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        publicationDeleteId={publicationDeleteId}

      />

      <ModalAddStockBook
        setIsOpen={setAddIsOpen}
        open={addIsOpen}
        actualStock={actualStock}

      />

      <ModalOutStockBook
        setIsOpen={setOutIsOpen}
        open={outIsOpen}
        actualStock={actualStock}

      />
    </>
  )
}
