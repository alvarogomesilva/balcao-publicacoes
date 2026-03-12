import { EmptyState } from "@/components/shared/empty-state";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import type { PublicationCollection } from "@/features/publications/types";
import { formatCollectionLabel } from "@/lib/format";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  Menu,
  Portal,
  Spinner,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDeferredValue, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { LuArrowDown, LuArrowUp, LuPackage2, LuSearch } from "react-icons/lu";
import { usePublications } from "../hooks/use-publications";
import type { Publication } from "../types";
import {
  CreatePublicationDialog,
  DeletePublicationDialog,
  StockMovementDialog,
  UpdatePublicationDialog,
} from "./publication-dialogs";

interface CatalogPageProps {
  collection: PublicationCollection;
  title: string;
  description: string;
}

export function CatalogPage({ collection, title, description }: CatalogPageProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState("");
  const [publicationToUpdate, setPublicationToUpdate] = useState({ id: "", name: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const deferredSearch = useDeferredValue(searchQuery);
  const { data: publications = [], isLoading } = usePublications(collection);

  const filteredPublications = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    if (!term) {
      return publications;
    }

    return publications.filter((item) =>
      [item.name, item.code, item.category].join(" ").toLowerCase().includes(term),
    );
  }, [deferredSearch, publications]);

  const stats = useMemo(() => {
    const active = publications.filter((item) => item.active).length;
    const totalStock = publications.reduce((acc, item) => acc + item.stock, 0);
    const lowStock = publications.filter((item) => item.stock <= 5).length;

    return {
      active,
      totalStock,
      lowStock,
    };
  }, [publications]);

  const hasActiveFilters = Boolean(deferredSearch.trim());

  return (
    <>
      <PageShell>
        <SectionHeader
          eyebrow={formatCollectionLabel(collection)}
          title={title}
          description={description}
          actions={
            <Button
              bg="teal.600"
              color="white"
              _hover={{ bg: "teal.500" }}
              onClick={() => setIsCreateOpen(true)}
            >
              <FiPlus />
              Adicionar
            </Button>
          }
        />

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
          <StatCard
            label="Titulos"
            value={publications.length}
            helper="Catalogo total disponivel nesta area."
            icon={<LuPackage2 color="#0f766e" />}
          />
          <StatCard
            label="Titulos ativos"
            value={stats.active}
            helper="Publicacoes marcadas como ativas."
            icon={<LuArrowUp color="#0f766e" />}
          />
          <StatCard
            label="Estoque total"
            value={stats.totalStock}
            helper={`${stats.lowStock} itens em atencao com estoque baixo.`}
            icon={<LuArrowDown color="#0f766e" />}
          />
        </Grid>

        <Box
          bg="rgba(255,255,255,0.88)"
          border="1px solid"
          borderColor="blackAlpha.100"
          borderRadius="28px"
          shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
          overflow="hidden"
        >
          <Flex
            px={{ base: 4, md: 6 }}
            py={5}
            borderBottom="1px solid"
            borderColor="blackAlpha.100"
            flexDirection={{ base: "column", lg: "row" }}
            gap={3}
            justifyContent="space-between"
            alignItems={{ base: "stretch", lg: "center" }}
          >
            <Box>
              <Text fontWeight="800" color="gray.900">
                Gestao do catalogo
              </Text>
              <Text color="gray.500" fontSize="sm">
                Consulta rapida, atualizacao de dados e movimentos de estoque.
              </Text>
            </Box>

            <InputGroup flex="1" maxW={{ lg: "420px" }} startElement={<LuSearch />}>
              <Input
                placeholder="Pesquisar por nome, codigo ou categoria"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                bg="gray.50"
                borderColor="transparent"
              />
            </InputGroup>
          </Flex>

          {isLoading ? (
            <VStack py={16} colorPalette="teal">
              <Spinner color="colorPalette.600" />
              <Text color="colorPalette.600">Carregando catalogo...</Text>
            </VStack>
          ) : !filteredPublications.length ? (
            <Box p={4}>
              <EmptyState
                title={hasActiveFilters ? "Nenhum resultado encontrado" : "Catalogo vazio"}
                description={
                  hasActiveFilters
                    ? "Tente buscar por outro termo ou limpe o filtro para ver todos os titulos."
                    : "Cadastre o primeiro titulo desta colecao para iniciar o controle de estoque."
                }
                icon={<LuPackage2 />}
                action={
                  hasActiveFilters
                    ? {
                        label: "Limpar busca",
                        onClick: () => setSearchQuery(""),
                      }
                    : {
                        label: "Adicionar titulo",
                        onClick: () => setIsCreateOpen(true),
                      }
                }
              />
            </Box>
          ) : (
            <>
              <Box display={{ base: "none", lg: "block" }} overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Nome</Table.ColumnHeader>
                      <Table.ColumnHeader>Codigo</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Estoque</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Acoes</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredPublications.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.code || "-"}</Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette={item.active ? "teal" : "gray"}>
                            {item.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>{item.stock}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <CatalogActions
                            item={item}
                            onStockIn={(id) => {
                              setSelectedPublicationId(id);
                              setIsStockInOpen(true);
                            }}
                            onStockOut={(id) => {
                              setSelectedPublicationId(id);
                              setIsStockOutOpen(true);
                            }}
                            onEdit={(publication) => {
                              setPublicationToUpdate({
                                id: publication.id,
                                name: publication.name,
                              });
                              setIsUpdateOpen(true);
                            }}
                            onDelete={(id) => {
                              setSelectedPublicationId(id);
                              setIsDeleteOpen(true);
                            }}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              <VStack display={{ base: "flex", lg: "none" }} align="stretch" p={4} gap={3}>
                {filteredPublications.map((item) => (
                  <Box
                    key={item.id}
                    border="1px solid"
                    borderColor="blackAlpha.100"
                    borderRadius="20px"
                    p={4}
                    bg="gray.50"
                  >
                    <Flex justify="space-between" align="flex-start" gap={3}>
                      <Box>
                        <Text fontWeight="800" color="gray.900">
                          {item.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Codigo: {item.code || "-"}
                        </Text>
                      </Box>
                      <Badge colorPalette={item.active ? "teal" : "gray"}>
                        {item.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </Flex>

                    <Flex mt={4} justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.600">
                        Estoque atual
                      </Text>
                      <Text fontWeight="800" color="gray.900">
                        {item.stock}
                      </Text>
                    </Flex>

                    <Flex mt={4} gap={2} wrap="wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPublicationId(item.id);
                          setIsStockInOpen(true);
                        }}
                      >
                        Entrada
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedPublicationId(item.id);
                          setIsStockOutOpen(true);
                        }}
                      >
                        Saida
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPublicationToUpdate({ id: item.id, name: item.name });
                          setIsUpdateOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="subtle"
                        onClick={() => {
                          setSelectedPublicationId(item.id);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Excluir
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </>
          )}
        </Box>
      </PageShell>

      <CreatePublicationDialog
        collection={collection}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <UpdatePublicationDialog
        collection={collection}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        values={publicationToUpdate}
      />
      <DeletePublicationDialog
        collection={collection}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        publicationId={selectedPublicationId}
      />
      <StockMovementDialog
        collection={collection}
        type="entrada"
        open={isStockInOpen}
        onOpenChange={setIsStockInOpen}
        publicationId={selectedPublicationId}
      />
      <StockMovementDialog
        collection={collection}
        type="saida"
        open={isStockOutOpen}
        onOpenChange={setIsStockOutOpen}
        publicationId={selectedPublicationId}
      />
    </>
  );
}

interface CatalogActionsProps {
  item: Publication;
  onStockIn: (id: string) => void;
  onStockOut: (id: string) => void;
  onEdit: (item: Publication) => void;
  onDelete: (id: string) => void;
}

function CatalogActions({
  item,
  onStockIn,
  onStockOut,
  onEdit,
  onDelete,
}: CatalogActionsProps) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          Opcoes
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="stock-in" onClick={() => onStockIn(item.id)}>
              Entrada estoque
            </Menu.Item>
            <Menu.Item value="stock-out" onClick={() => onStockOut(item.id)}>
              Saida estoque
            </Menu.Item>
            <Menu.Item value="edit" onClick={() => onEdit(item)}>
              Editar
            </Menu.Item>
            <Menu.Item value="delete" onClick={() => onDelete(item.id)}>
              Excluir
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
