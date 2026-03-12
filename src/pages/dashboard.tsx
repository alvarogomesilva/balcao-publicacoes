import { EmptyState } from "@/components/shared/empty-state";
import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { useDashboardSummary } from "@/features/publications/hooks/use-publications";
import {
  formatCollectionLabel,
  formatCurrency,
  formatDateTime,
  formatOrderStatus,
  getOrderStatusColor,
} from "@/lib/format";
import {
  Badge,
  Box,
  Grid,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuActivity,
  LuArchive,
  LuPackageSearch,
  LuShieldAlert,
  LuShoppingCart,
  LuUsers,
} from "react-icons/lu";

export function Dashboard() {
  const { data, isLoading } = useDashboardSummary();

  return (
    <>
      <Navbar />
      <PageShell>
        <SectionHeader
          eyebrow="Dashboard"
          title="Visao geral da operacao"
          description="Resumo consolidado de catalogo, clientes, pedidos e atividade recente para orientar a rotina sem trocar de modulo o tempo todo."
        />

        {isLoading || !data ? (
          <VStack py={20} colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Montando o dashboard...</Text>
          </VStack>
        ) : (
          <Stack gap={6}>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
              <StatCard
                label="Titulos cadastrados"
                value={data.totalTitles}
                helper={`${data.activeTitles} ativos e ${data.lowStockCount} em atencao.`}
                icon={<LuArchive color="#0f766e" />}
              />
              <StatCard
                label="Estoque total"
                value={data.totalStock}
                helper="Soma de unidades em todas as colecoes."
                icon={<LuPackageSearch color="#0f766e" />}
              />
              <StatCard
                label="Clientes ativos"
                value={data.activeCustomers}
                helper={`${data.totalCustomers} clientes cadastrados na base.`}
                icon={<LuUsers color="#0f766e" />}
              />
              <StatCard
                label="Pedidos em aberto"
                value={data.openOrders}
                helper={`${data.totalOrders} pedidos no historico geral.`}
                icon={<LuShoppingCart color="#0f766e" />}
              />
              <StatCard
                label="Volume vendido"
                value={formatCurrency(data.salesVolume)}
                helper="Soma de pedidos nao cancelados."
                icon={<LuActivity color="#0f766e" />}
              />
              <StatCard
                label="Atencao de estoque"
                value={data.lowStockCount}
                helper="Itens com 5 unidades ou menos."
                icon={<LuShieldAlert color="#b45309" />}
              />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", xl: "1.15fr 0.85fr" }} gap={5}>
              <Box
                bg="rgba(255,255,255,0.88)"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Distribuicao por colecao
                </Text>

                <Stack gap={4}>
                  {data.collections.map((item) => {
                    const percentage = data.totalStock
                      ? Math.round((item.totalStock / data.totalStock) * 100)
                      : 0;

                    return (
                      <Box key={item.collection}>
                        <HStack justify="space-between" mb={2}>
                          <Box>
                            <Text fontWeight="700" color="gray.900">
                              {formatCollectionLabel(item.collection)}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {item.titleCount} titulos, {item.activeCount} ativos
                            </Text>
                          </Box>
                          <Badge colorPalette="teal">{item.totalStock} un.</Badge>
                        </HStack>

                        <Box bg="gray.100" h="10px" borderRadius="full" overflow="hidden">
                          <Box
                            bg="teal.500"
                            h="10px"
                            borderRadius="full"
                            w={`${percentage}%`}
                            transition="width 0.2s ease"
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              <Box
                bg="rgba(255,255,255,0.88)"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Pedidos recentes
                </Text>

                {data.recentOrders.length ? (
                  <Stack gap={3}>
                    {data.recentOrders.map((order) => (
                      <Box
                        key={order.id}
                        borderRadius="20px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="blackAlpha.50"
                        p={4}
                      >
                        <HStack justify="space-between" align="flex-start" mb={2}>
                          <Box>
                            <Text fontWeight="700" color="gray.900">
                              {order.code}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {order.customerName}
                            </Text>
                          </Box>
                          <Badge colorPalette={getOrderStatusColor(order.status)}>
                            {formatOrderStatus(order.status)}
                          </Badge>
                        </HStack>

                        <Text fontSize="sm" color="gray.600">
                          {order.items.length} itens | {formatCurrency(order.totalAmount)}
                        </Text>
                        <Text mt={2} fontSize="xs" color="gray.500">
                          {formatDateTime(order.createdAt as Date | null)}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState
                    title="Nenhum pedido registrado"
                    description="Os pedidos recentes vao aparecer aqui assim que a operacao comercial comecar."
                    icon={<LuShoppingCart />}
                  />
                )}
              </Box>
            </Grid>

            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={5}>
              <Box
                bg="rgba(255,255,255,0.88)"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Top clientes
                </Text>

                {data.topCustomers.length ? (
                  <Stack gap={3}>
                    {data.topCustomers.map((customer) => (
                      <Box
                        key={customer.id}
                        borderRadius="18px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="blackAlpha.50"
                        p={4}
                      >
                        <HStack justify="space-between" align="flex-start" gap={3} mb={3}>
                          <Box>
                            <Text fontWeight="700" color="gray.900">
                              {customer.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {customer.email || customer.phone || customer.city}
                            </Text>
                          </Box>
                          <Badge colorPalette="teal">{customer.orderCount} pedidos</Badge>
                        </HStack>

                        <Text fontSize="sm" color="gray.600">
                          Volume movimentado: {formatCurrency(customer.totalSpent)}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState
                    title="Base sem historico de vendas"
                    description="Quando os primeiros pedidos forem emitidos, os clientes mais ativos aparecerao aqui."
                    icon={<LuUsers />}
                  />
                )}
              </Box>

              <Box
                bg="rgba(255,255,255,0.88)"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Ultimas movimentacoes
                </Text>

                {data.recentMovements.length ? (
                  <Stack gap={3}>
                    {data.recentMovements.map((movement) => (
                      <Box
                        key={movement.id}
                        borderRadius="20px"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="blackAlpha.50"
                        p={4}
                      >
                        <HStack justify="space-between" align="flex-start" mb={2}>
                          <Box>
                            <Text fontWeight="700" color="gray.900">
                              {movement.publicationName}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatCollectionLabel(movement.publicationCollection)}
                            </Text>
                          </Box>
                          <Badge colorPalette={movement.type === "entrada" ? "teal" : "orange"}>
                            {movement.type}
                          </Badge>
                        </HStack>

                        <Text fontSize="sm" color="gray.600">
                          Quantidade: {movement.quantity} | Estoque {movement.previousStock} para{" "}
                          {movement.nextStock}
                        </Text>
                        <Text mt={2} fontSize="xs" color="gray.500">
                          {formatDateTime(movement.createdAt as Date | null)}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState
                    title="Sem movimentacoes recentes"
                    description="Entradas, saidas e ajustes de estoque serao listados aqui."
                    icon={<LuArchive />}
                  />
                )}
              </Box>
            </Grid>
          </Stack>
        )}
      </PageShell>
    </>
  );
}
