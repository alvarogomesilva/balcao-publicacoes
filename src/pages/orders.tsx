import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatCollectionLabel, formatDateTime } from "@/lib/format";
import { useRecentMovements } from "@/features/publications/hooks/use-publications";
import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export function Order() {
  const { data: movements = [], isLoading } = useRecentMovements(30);
  const [typeFilter, setTypeFilter] = useState<"todos" | "entrada" | "saida">("todos");
  const [collectionFilter, setCollectionFilter] = useState<string>("todos");

  const visibleMovements = movements.filter((movement) => {
    const matchesType = typeFilter === "todos" || movement.type === typeFilter;
    const matchesCollection =
      collectionFilter === "todos" || movement.publicationCollection === collectionFilter;

    return matchesType && matchesCollection;
  });

  const totalEntries = visibleMovements
    .filter((item) => item.type === "entrada")
    .reduce((acc, item) => acc + item.quantity, 0);
  const totalOutputs = visibleMovements
    .filter((item) => item.type === "saida")
    .reduce((acc, item) => acc + item.quantity, 0);
  const impactedTitles = new Set(visibleMovements.map((item) => item.publication)).size;
  const collections = Array.from(
    new Set(movements.map((item) => item.publicationCollection)),
  );

  return (
    <>
      <Navbar />
      <PageShell>
        <SectionHeader
          eyebrow="Pedidos"
          title="Central operacional"
          description="Painel de movimentações recentes para acompanhar entradas, saídas e os títulos mais impactados do período."
        />

        {isLoading ? (
          <VStack py={20} colorPalette="teal">
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Carregando movimentações...</Text>
          </VStack>
        ) : (
          <Stack gap={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <StatCard
                label="Entradas visíveis"
                value={totalEntries}
                helper="Soma das entradas conforme os filtros aplicados."
              />
              <StatCard
                label="Saídas visíveis"
                value={totalOutputs}
                helper="Soma das saídas conforme os filtros aplicados."
              />
              <StatCard
                label="Títulos impactados"
                value={impactedTitles}
                helper="Quantidade de publicações com movimento recente."
              />
            </SimpleGrid>

            <Box
              bg="white"
              borderRadius="28px"
              border="1px solid"
              borderColor="blackAlpha.100"
              p={{ base: 5, md: 6 }}
              shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
            >
              <Stack gap={4}>
                <Box>
                  <Text fontWeight="800" color="gray.900">
                    Filtros rápidos
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Ajuste a leitura do fluxo sem sair da mesma tela.
                  </Text>
                </Box>

                <Stack gap={3}>
                  <HStack flexWrap="wrap" gap={2}>
                    {["todos", "entrada", "saida"].map((type) => (
                      <Button
                        key={type}
                        size="sm"
                        borderRadius="full"
                        variant={typeFilter === type ? "solid" : "outline"}
                        colorPalette={typeFilter === type ? "teal" : "gray"}
                        onClick={() =>
                          setTypeFilter(type as "todos" | "entrada" | "saida")
                        }
                      >
                        {type}
                      </Button>
                    ))}
                  </HStack>

                  <HStack flexWrap="wrap" gap={2}>
                    <Button
                      size="sm"
                      borderRadius="full"
                      variant={collectionFilter === "todos" ? "solid" : "outline"}
                      colorPalette={collectionFilter === "todos" ? "teal" : "gray"}
                      onClick={() => setCollectionFilter("todos")}
                    >
                      Todas as coleções
                    </Button>

                    {collections.map((item) => (
                      <Button
                        key={item}
                        size="sm"
                        borderRadius="full"
                        variant={collectionFilter === item ? "solid" : "outline"}
                        colorPalette={collectionFilter === item ? "teal" : "gray"}
                        onClick={() => setCollectionFilter(item)}
                      >
                        {formatCollectionLabel(item)}
                      </Button>
                    ))}
                  </HStack>
                </Stack>
              </Stack>
            </Box>

            <Grid templateColumns={{ base: "1fr", xl: "1.05fr 0.95fr" }} gap={5}>
              <Box
                bg="white"
                borderRadius="28px"
                border="1px solid"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                shadow="0 20px 50px rgba(15, 23, 42, 0.08)"
              >
                <Text fontWeight="800" color="gray.900" mb={4}>
                  Linha do tempo de movimentações
                </Text>

                <Stack gap={3}>
                  {visibleMovements.map((movement) => (
                    <Box
                      key={movement.id}
                      borderRadius="20px"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="blackAlpha.50"
                      p={4}
                    >
                      <HStack justify="space-between" align="flex-start">
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

                      <Text mt={3} fontSize="sm" color="gray.600">
                        Quantidade movimentada: {movement.quantity}
                      </Text>
                      <Text mt={1} fontSize="sm" color="gray.600">
                        Estoque {movement.previousStock} → {movement.nextStock}
                      </Text>
                      <Text mt={2} fontSize="xs" color="gray.500">
                        {formatDateTime(movement.createdAt as Date | null)}
                      </Text>
                    </Box>
                  ))}
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
                  Leitura rápida
                </Text>

                <Stack gap={4}>
                  <Box borderRadius="22px" bg="teal.50" p={4}>
                    <Text fontWeight="700" color="teal.800">
                      Ritmo atual
                    </Text>
                    <Text mt={2} color="teal.900">
                      {totalOutputs > totalEntries
                        ? "As saídas superaram as entradas no recorte atual."
                        : "As entradas estão equilibradas ou acima das saídas."}
                    </Text>
                  </Box>

                  <Box borderRadius="22px" bg="orange.50" p={4}>
                    <Text fontWeight="700" color="orange.800">
                      Coleções em foco
                    </Text>
                    <Text mt={2} color="orange.900">
                      Use os filtros para isolar um catálogo específico e acompanhar a pressão
                      operacional sem sair da tela.
                    </Text>
                  </Box>

                  <Box borderRadius="22px" bg="gray.50" p={4}>
                    <Text fontWeight="700" color="gray.800">
                      Próximo passo
                    </Text>
                    <Text mt={2} color="gray.700">
                      Se quiser, o próximo incremento natural aqui é adicionar um fluxo formal de
                      pedidos com cliente, status e itens vinculados.
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Stack>
        )}
      </PageShell>
    </>
  );
}
