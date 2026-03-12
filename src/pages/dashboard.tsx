import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatCollectionLabel, formatDateTime } from "@/lib/format";
import { useDashboardSummary } from "@/features/publications/hooks/use-publications";
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
import { LuActivity, LuArchive, LuPackageSearch, LuShieldAlert } from "react-icons/lu";

export function Dashboard() {
  const { data, isLoading } = useDashboardSummary();

  return (
    <>
      <Navbar />
      <PageShell>
        <SectionHeader
          eyebrow="Dashboard"
          title="Visão geral da operação"
          description="Resumo consolidado de catálogo, estoque e atividade recente para orientar a rotina sem precisar navegar por várias telas."
        />

        {isLoading || !data ? (
          <VStack py={20} colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Montando o dashboard...</Text>
          </VStack>
        ) : (
          <Stack gap={6}>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
              <StatCard
                label="Títulos cadastrados"
                value={data.totalTitles}
                helper="Soma de todas as coleções disponíveis."
                icon={<LuArchive color="#0f766e" />}
              />
              <StatCard
                label="Títulos ativos"
                value={data.activeTitles}
                helper="Itens prontos para operação."
                icon={<LuActivity color="#0f766e" />}
              />
              <StatCard
                label="Estoque total"
                value={data.totalStock}
                helper="Unidades somadas em todas as frentes."
                icon={<LuPackageSearch color="#0f766e" />}
              />
              <StatCard
                label="Atenção de estoque"
                value={data.lowStockCount}
                helper="Itens com 5 unidades ou menos."
                icon={<LuShieldAlert color="#b45309" />}
              />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap={5}>
              <Box
                bg="white"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Distribuição por coleção
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
                              {item.titleCount} títulos, {item.activeCount} ativos
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
                bg="white"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Últimas movimentações
                </Text>

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
                        Quantidade: {movement.quantity} | Estoque {movement.previousStock} →{" "}
                        {movement.nextStock}
                      </Text>
                      <Text mt={2} fontSize="xs" color="gray.500">
                        {formatDateTime(movement.createdAt as Date | null)}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Stack>
        )}
      </PageShell>
    </>
  );
}
