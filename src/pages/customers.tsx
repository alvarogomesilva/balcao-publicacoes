import { EmptyState } from "@/components/shared/empty-state";
import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { CustomerDialog } from "@/features/customers/components/customer-dialog";
import { useCustomers, useToggleCustomerMutation } from "@/features/customers/hooks/use-customers";
import type { Customer } from "@/features/customers/types";
import { getErrorMessage } from "@/lib/errors";
import { formatDateTime } from "@/lib/format";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
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
import { LuMail, LuMapPin, LuPhone, LuSearch, LuUsers } from "react-icons/lu";
import { toast } from "sonner";

function mapCustomerToForm(customer: Customer) {
  return {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city: customer.city,
    notes: customer.notes,
    active: customer.active,
  };
}

export function Customers() {
  const { data: customers = [], isLoading } = useCustomers();
  const toggleMutation = useToggleCustomerMutation();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    if (!term) {
      return customers;
    }

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.city]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [customers, deferredSearch]);

  const stats = useMemo(() => {
    const active = customers.filter((item) => item.active).length;
    const withEmail = customers.filter((item) => item.email).length;

    return {
      total: customers.length,
      active,
      withEmail,
    };
  }, [customers]);

  async function handleToggle(customer: Customer) {
    try {
      await toggleMutation.mutateAsync({ id: customer.id, active: !customer.active });
    } catch (error) {
      toast.error(getErrorMessage(error, "Nao foi possivel atualizar o status do cliente."));
    }
  }

  return (
    <>
      <Navbar />
      <PageShell>
        <SectionHeader
          eyebrow="Clientes"
          title="Cadastro de pessoas e organizacoes"
          description="Base de clientes para emissao de pedidos, acompanhamento de contato e organizacao da operacao comercial."
          actions={
            <Button
              bg="teal.600"
              color="white"
              _hover={{ bg: "teal.500" }}
              onClick={() => setIsCreateOpen(true)}
            >
              <FiPlus />
              Novo cliente
            </Button>
          }
        />

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
          <StatCard
            label="Clientes cadastrados"
            value={stats.total}
            helper="Base total de pessoas e organizacoes."
            icon={<LuUsers color="#0f766e" />}
          />
          <StatCard
            label="Clientes ativos"
            value={stats.active}
            helper="Prontos para novos pedidos."
            icon={<LuPhone color="#0f766e" />}
          />
          <StatCard
            label="Com email valido"
            value={stats.withEmail}
            helper="Bom indicador de contato e confirmacao."
            icon={<LuMail color="#0f766e" />}
          />
        </Grid>

        <Box
          bg="rgba(255,255,255,0.88)"
          borderRadius="28px"
          border="1px solid"
          borderColor="blackAlpha.100"
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
                Lista de clientes
              </Text>
              <Text color="gray.500" fontSize="sm">
                Busque por nome, email, telefone ou cidade.
              </Text>
            </Box>

            <InputGroup flex="1" maxW={{ lg: "420px" }} startElement={<LuSearch />}>
              <Input
                placeholder="Pesquisar cliente"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="gray.50"
                borderColor="transparent"
              />
            </InputGroup>
          </Flex>

          {isLoading ? (
            <VStack py={16} colorPalette="teal">
              <Spinner color="colorPalette.600" />
              <Text color="colorPalette.600">Carregando clientes...</Text>
            </VStack>
          ) : !filteredCustomers.length ? (
            <Box p={4}>
              <EmptyState
                title={search.trim() ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                description={
                  search.trim()
                    ? "Tente outro nome, email, telefone ou cidade para localizar o cliente."
                    : "Cadastre a primeira pessoa ou organizacao para liberar o fluxo de pedidos."
                }
                icon={<LuUsers />}
                action={
                  search.trim()
                    ? { label: "Limpar busca", onClick: () => setSearch("") }
                    : { label: "Novo cliente", onClick: () => setIsCreateOpen(true) }
                }
              />
            </Box>
          ) : (
            <>
              <Box display={{ base: "none", lg: "block" }} overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Cliente</Table.ColumnHeader>
                      <Table.ColumnHeader>Contato</Table.ColumnHeader>
                      <Table.ColumnHeader>Cidade</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Atualizado</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Acoes</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredCustomers.map((customer) => (
                      <Table.Row key={customer.id}>
                        <Table.Cell>{customer.name}</Table.Cell>
                        <Table.Cell>
                          <VStack align="start" gap={1}>
                            <Text>{customer.email}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {customer.phone}
                            </Text>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell>{customer.city}</Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette={customer.active ? "teal" : "gray"}>
                            {customer.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>{formatDateTime(customer.updatedAt as Date | null)}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <Menu.Root>
                            <Menu.Trigger asChild>
                              <Button size="sm" variant="outline">
                                Acoes
                              </Button>
                            </Menu.Trigger>
                            <Portal>
                              <Menu.Positioner>
                                <Menu.Content>
                                  <Menu.Item
                                    value="edit"
                                    onClick={() => {
                                      setSelectedCustomer(customer);
                                      setIsEditOpen(true);
                                    }}
                                  >
                                    Editar
                                  </Menu.Item>
                                  <Menu.Item
                                    value="toggle"
                                    onClick={() => handleToggle(customer)}
                                  >
                                    {customer.active ? "Desativar" : "Reativar"}
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

              <VStack display={{ base: "flex", lg: "none" }} align="stretch" p={4} gap={3}>
                {filteredCustomers.map((customer) => (
                  <Box
                    key={customer.id}
                    borderRadius="20px"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="blackAlpha.100"
                    p={4}
                  >
                    <Flex justify="space-between" align="flex-start" gap={3}>
                      <Box>
                        <Text fontWeight="800" color="gray.900">
                          {customer.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {customer.email}
                        </Text>
                      </Box>
                      <Badge colorPalette={customer.active ? "teal" : "gray"}>
                        {customer.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </Flex>

                    <VStack align="start" mt={4} gap={2} color="gray.600" fontSize="sm">
                      <HStack gap={2}>
                        <LuPhone />
                        <Text>{customer.phone}</Text>
                      </HStack>
                      <HStack gap={2}>
                        <LuMapPin />
                        <Text>{customer.city}</Text>
                      </HStack>
                    </VStack>

                    <HStack mt={4} gap={2} flexWrap="wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsEditOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        colorPalette={customer.active ? "red" : "teal"}
                        variant="subtle"
                        onClick={() => handleToggle(customer)}
                      >
                        {customer.active ? "Desativar" : "Reativar"}
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </>
          )}
        </Box>
      </PageShell>

      <CustomerDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
      />

      <CustomerDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        customerId={selectedCustomer?.id}
        defaultValues={selectedCustomer ? mapCustomerToForm(selectedCustomer) : undefined}
      />
    </>
  );
}
