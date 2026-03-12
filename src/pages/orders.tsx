import { EmptyState } from "@/components/shared/empty-state";
import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  CreateOrderDialog,
  OrderDetailsDialog,
  OrderStatusDialog,
} from "@/features/orders/components/order-dialogs";
import { useOrders } from "@/features/orders/hooks/use-orders";
import type { Order, OrderStatus } from "@/features/orders/types";
import {
  formatCurrency,
  formatDateTime,
  formatOrderStatus,
  getOrderStatusColor,
} from "@/lib/format";
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
import { Link } from "react-router";
import { FiPlus } from "react-icons/fi";
import { LuClipboardList, LuSearch, LuTruck, LuWallet } from "react-icons/lu";

const statusOptions: OrderStatus[] = [
  "novo",
  "separando",
  "enviado",
  "entregue",
  "cancelado",
];

export function Order() {
  const { data: orders = [], isLoading } = useOrders();
  const [statusFilter, setStatusFilter] = useState<"todos" | OrderStatus>("todos");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus | null>(null);

  const filteredOrders = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "todos" || order.status === statusFilter;
      const matchesSearch =
        !term ||
        [order.code, order.customerName, ...order.items.map((item) => item.publicationName)]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [deferredSearch, orders, statusFilter]);

  const stats = useMemo(() => {
    const open = orders.filter(
      (order) => order.status !== "entregue" && order.status !== "cancelado",
    ).length;
    const delivered = orders.filter((order) => order.status === "entregue").length;
    const sales = orders
      .filter((order) => order.status !== "cancelado")
      .reduce((acc, order) => acc + order.totalAmount, 0);

    return {
      total: orders.length,
      open,
      delivered,
      sales,
    };
  }, [orders]);

  return (
    <>
      <Navbar />
      <PageShell>
        <SectionHeader
          eyebrow="Pedidos"
          title="Gestao completa de pedidos"
          description="Crie pedidos vinculados a clientes, acompanhe status, consulte itens vendidos e controle o impacto direto no estoque."
          actions={
            <>
              <Link to="/customers">
                <Button variant="outline">Clientes</Button>
              </Link>
              <Button
                bg="teal.600"
                color="white"
                _hover={{ bg: "teal.500" }}
                onClick={() => setIsCreateOpen(true)}
              >
                <FiPlus />
                Novo pedido
              </Button>
            </>
          }
        />

        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={6}>
          <StatCard
            label="Pedidos totais"
            value={stats.total}
            helper="Historico completo de pedidos emitidos."
            icon={<LuClipboardList color="#0f766e" />}
          />
          <StatCard
            label="Pedidos em aberto"
            value={stats.open}
            helper="Nao concluidos e ainda em operacao."
            icon={<LuTruck color="#0f766e" />}
          />
          <StatCard
            label="Pedidos entregues"
            value={stats.delivered}
            helper="Fluxo finalizado com sucesso."
            icon={<LuTruck color="#0f766e" />}
          />
          <StatCard
            label="Volume vendido"
            value={formatCurrency(stats.sales)}
            helper="Soma dos pedidos ativos e entregues."
            icon={<LuWallet color="#0f766e" />}
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
            flexDirection={{ base: "column", xl: "row" }}
            gap={4}
            justifyContent="space-between"
            alignItems={{ base: "stretch", xl: "center" }}
          >
            <VStack align="stretch" gap={3}>
              <Box>
                <Text fontWeight="800" color="gray.900">
                  Painel de pedidos
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Consulte por cliente, codigo do pedido ou titulo vendido.
                </Text>
              </Box>

              <HStack gap={2} flexWrap="wrap">
                <Button
                  size="sm"
                  borderRadius="full"
                  variant={statusFilter === "todos" ? "solid" : "outline"}
                  colorPalette={statusFilter === "todos" ? "teal" : "gray"}
                  onClick={() => setStatusFilter("todos")}
                >
                  Todos
                </Button>
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    borderRadius="full"
                    variant={statusFilter === status ? "solid" : "outline"}
                    colorPalette={statusFilter === status ? "teal" : "gray"}
                    onClick={() => setStatusFilter(status)}
                  >
                    {formatOrderStatus(status)}
                  </Button>
                ))}
              </HStack>
            </VStack>

            <InputGroup flex="1" maxW={{ xl: "420px" }} startElement={<LuSearch />}>
              <Input
                placeholder="Buscar pedido"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                bg="gray.50"
                borderColor="transparent"
              />
            </InputGroup>
          </Flex>

          {isLoading ? (
            <VStack py={16} colorPalette="teal">
              <Spinner color="colorPalette.600" />
              <Text color="colorPalette.600">Carregando pedidos...</Text>
            </VStack>
          ) : !filteredOrders.length ? (
            <Box p={4}>
              <EmptyState
                title={search.trim() || statusFilter !== "todos" ? "Nenhum pedido encontrado" : "Nenhum pedido criado"}
                description={
                  search.trim() || statusFilter !== "todos"
                    ? "Ajuste a busca ou o filtro de status para encontrar outros pedidos."
                    : "Crie o primeiro pedido para acompanhar vendas, estoque e andamento de entrega."
                }
                icon={<LuClipboardList />}
                action={
                  search.trim() || statusFilter !== "todos"
                    ? {
                        label: "Limpar filtros",
                        onClick: () => {
                          setSearch("");
                          setStatusFilter("todos");
                        },
                      }
                    : { label: "Novo pedido", onClick: () => setIsCreateOpen(true) }
                }
              />
            </Box>
          ) : (
            <>
              <Box display={{ base: "none", xl: "block" }} overflowX="auto">
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Pedido</Table.ColumnHeader>
                      <Table.ColumnHeader>Cliente</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Total</Table.ColumnHeader>
                      <Table.ColumnHeader>Criado em</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="center">Acoes</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredOrders.map((order) => (
                      <Table.Row key={order.id}>
                        <Table.Cell>
                          <VStack align="start" gap={1}>
                            <Text fontWeight="700">{order.code}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {order.items.length} itens
                            </Text>
                          </VStack>
                        </Table.Cell>
                        <Table.Cell>{order.customerName}</Table.Cell>
                        <Table.Cell>
                          <Badge colorPalette={getOrderStatusColor(order.status)}>
                            {formatOrderStatus(order.status)}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>{formatCurrency(order.totalAmount)}</Table.Cell>
                        <Table.Cell>{formatDateTime(order.createdAt as Date | null)}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <OrderActions
                            order={order}
                            onViewDetails={() => setDetailOrder(order)}
                            onChangeStatus={(status) => {
                              setStatusOrder(order);
                              setNextStatus(status);
                            }}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              <VStack display={{ base: "flex", xl: "none" }} align="stretch" p={4} gap={3}>
                {filteredOrders.map((order) => (
                  <Box
                    key={order.id}
                    borderRadius="20px"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="blackAlpha.100"
                    p={4}
                  >
                    <Flex justify="space-between" align="flex-start" gap={3}>
                      <Box>
                        <Text fontWeight="800" color="gray.900">
                          {order.code}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {order.customerName}
                        </Text>
                      </Box>
                      <Badge colorPalette={getOrderStatusColor(order.status)}>
                        {formatOrderStatus(order.status)}
                      </Badge>
                    </Flex>

                    <Text mt={3} fontSize="sm" color="gray.600">
                      {order.items.length} itens | {formatCurrency(order.totalAmount)}
                    </Text>
                    <Text mt={1} fontSize="sm" color="gray.500">
                      {formatDateTime(order.createdAt as Date | null)}
                    </Text>

                    <HStack mt={4} gap={2} flexWrap="wrap">
                      <Button size="sm" variant="outline" onClick={() => setDetailOrder(order)}>
                        Detalhes
                      </Button>
                      {statusOptions
                        .filter((status) => status !== order.status)
                        .slice(0, 2)
                        .map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setStatusOrder(order);
                              setNextStatus(status);
                            }}
                          >
                            {formatOrderStatus(status)}
                          </Button>
                        ))}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </>
          )}
        </Box>
      </PageShell>

      <CreateOrderDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <OrderDetailsDialog
        order={detailOrder}
        open={!!detailOrder}
        onOpenChange={(open) => {
          if (!open) {
            setDetailOrder(null);
          }
        }}
      />
      <OrderStatusDialog
        order={statusOrder}
        nextStatus={nextStatus}
        open={!!statusOrder && !!nextStatus}
        onOpenChange={(open) => {
          if (!open) {
            setStatusOrder(null);
            setNextStatus(null);
          }
        }}
      />
    </>
  );
}

interface OrderActionsProps {
  order: Order;
  onViewDetails: () => void;
  onChangeStatus: (status: OrderStatus) => void;
}

function OrderActions({ order, onViewDetails, onChangeStatus }: OrderActionsProps) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button size="sm" variant="outline">
          Acoes
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="details" onClick={onViewDetails}>
              Ver detalhes
            </Menu.Item>
            {statusOptions
              .filter((status) => status !== order.status)
              .map((status) => (
                <Menu.Item key={status} value={status} onClick={() => onChangeStatus(status)}>
                  Mover para {formatOrderStatus(status)}
                </Menu.Item>
              ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
