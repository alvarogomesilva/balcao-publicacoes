import logoImg from "@/assets/logo.png";
import imageDespertai from "@/assets/despertais.png";
import imageOutrasPublicacoes from "@/assets/outras_publicacoes.png";
import ordersImg from "@/assets/orders.png";
import publicationsImg from "@/assets/publications.png";
import imageSentinela from "@/assets/sentinelas.png";
import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { useDashboardSummary } from "@/features/publications/hooks/use-publications";
import { formatCurrency } from "@/lib/format";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { LuPackageSearch, LuShoppingCart, LuUsers, LuWallet } from "react-icons/lu";
import { Link } from "react-router";

const sections = [
  {
    title: "Livros",
    description: "Catalogo principal com fluxo completo de cadastro, atualizacao e estoque.",
    image: publicationsImg,
    href: "/books",
    accent: "#d8fbef",
    badge: "Catalogo",
  },
  {
    title: "Clientes",
    description: "Cadastro central de pessoas e organizacoes para sustentar novos pedidos.",
    image: logoImg,
    href: "/customers",
    accent: "#e3efff",
    badge: "Relacionamento",
  },
  {
    title: "Pedidos",
    description: "Modulo comercial com cliente, itens, valor total e atualizacao de status.",
    image: ordersImg,
    href: "/orders",
    accent: "#fff1d6",
    badge: "Operacao",
  },
  {
    title: "Sentinelas",
    description: "Linha dedicada com a mesma base de gestao, pesquisa e movimentacao fluida.",
    image: imageSentinela,
    href: "/sentinels",
    accent: "#d8edff",
    badge: "Colecao",
  },
  {
    title: "Despertais",
    description: "Gestao enxuta para titulos Despertai com navegacao responsiva e rapida.",
    image: imageDespertai,
    href: "/awaken",
    accent: "#ecf3ff",
    badge: "Colecao",
  },
  {
    title: "Outras publicacoes",
    description: "Espaco flexivel para materiais complementares e itens fora das linhas principais.",
    image: imageOutrasPublicacoes,
    href: "/others",
    accent: "#ffe2d8",
    badge: "Flexivel",
  },
];

export function Home() {
  const { data, isLoading } = useDashboardSummary();

  return (
    <>
      <Navbar />
      <PageShell>
        <Box
          position="relative"
          borderRadius="32px"
          overflow="hidden"
          bg="linear-gradient(135deg, #052f38 0%, #0f766e 48%, #ccfbf1 100%)"
          color="white"
          p={{ base: 6, md: 8 }}
          mb={6}
          shadow="0 28px 60px rgba(8, 51, 68, 0.32)"
          _before={{
            content: '""',
            position: "absolute",
            inset: 0,
            bg: "linear-gradient(120deg, rgba(255,255,255,0.08), transparent 45%)",
          }}
        >
          <Grid
            position="relative"
            templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
            gap={6}
            alignItems="center"
          >
            <Stack gap={5}>
              <Badge
                alignSelf="flex-start"
                bg="rgba(255,255,255,0.14)"
                color="white"
                px={3}
                py={1}
              >
                Sistema web
              </Badge>
              <Heading size={{ base: "xl", md: "2xl" }} lineHeight="1.05">
                Controle catalogo, clientes e pedidos em uma unica operacao.
              </Heading>
              <Text color="whiteAlpha.900" maxW="720px">
                A interface foi reorganizada para responder bem no desktop e no mobile, com foco
                em velocidade de consulta e fluxo diario de trabalho.
              </Text>

              <HStack gap={3} flexWrap="wrap">
                <Link to="/orders">
                  <Button bg="white" color="teal.800" _hover={{ bg: "whiteAlpha.900" }}>
                    Abrir pedidos
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    borderColor="rgba(255,255,255,0.28)"
                    color="white"
                    _hover={{ bg: "rgba(255,255,255,0.08)" }}
                  >
                    Ver dashboard
                  </Button>
                </Link>
              </HStack>
            </Stack>

            <Box
              borderRadius="28px"
              bg="rgba(255,255,255,0.12)"
              border="1px solid rgba(255,255,255,0.18)"
              p={5}
            >
              <Text fontWeight="700" mb={4}>
                Operacao em 3 passos
              </Text>
              <Stack gap={3}>
                {[
                  "Cadastre clientes e mantenha a base ativa.",
                  "Monte pedidos com itens dos catalogos e baixa imediata de estoque.",
                  "Acompanhe status, vendas e movimentacoes no dashboard.",
                ].map((step, index) => (
                  <Flex
                    key={step}
                    align="center"
                    gap={3}
                    bg="rgba(255,255,255,0.08)"
                    borderRadius="18px"
                    px={3}
                    py={3}
                  >
                    <Box
                      flexShrink={0}
                      w="32px"
                      h="32px"
                      borderRadius="12px"
                      bg="rgba(255,255,255,0.16)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="800"
                    >
                      {index + 1}
                    </Box>
                    <Text color="whiteAlpha.900" fontSize="sm">
                      {step}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Box>

        {isLoading || !data ? (
          <Box
            mb={6}
            borderRadius="28px"
            border="1px solid"
            borderColor="blackAlpha.100"
            bg="rgba(255,255,255,0.78)"
            p={8}
          >
            <HStack color="teal.700">
              <Spinner size="sm" />
              <Text fontWeight="600">Carregando indicadores principais...</Text>
            </HStack>
          </Box>
        ) : (
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }}
            gap={4}
            mb={6}
          >
            <StatCard
              label="Titulos ativos"
              value={data.activeTitles}
              helper={`${data.totalTitles} titulos cadastrados no catalogo.`}
              icon={<LuPackageSearch color="#0f766e" />}
            />
            <StatCard
              label="Clientes ativos"
              value={data.activeCustomers}
              helper={`${data.totalCustomers} clientes na base.`}
              icon={<LuUsers color="#0f766e" />}
            />
            <StatCard
              label="Pedidos em aberto"
              value={data.openOrders}
              helper={`${data.totalOrders} pedidos no historico.`}
              icon={<LuShoppingCart color="#0f766e" />}
            />
            <StatCard
              label="Vendas movimentadas"
              value={formatCurrency(data.salesVolume)}
              helper="Acumulado de pedidos nao cancelados."
              icon={<LuWallet color="#0f766e" />}
            />
          </Grid>
        )}

        <SectionHeader
          eyebrow="Modulos"
          title="Escolha uma area para continuar"
          description="Cada modulo segue o mesmo padrao visual e operacional para manter a navegacao simples e consistente."
        />

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
          {sections.map((section) => (
            <Link key={section.href} to={section.href}>
              <Box
                h="100%"
                bg="rgba(255,255,255,0.88)"
                borderRadius="30px"
                border="1px solid"
                borderColor="blackAlpha.100"
                overflow="hidden"
                shadow="0 24px 50px rgba(15, 23, 42, 0.09)"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "0 28px 64px rgba(15, 23, 42, 0.12)",
                }}
              >
                <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} minH="260px">
                  <Stack p={{ base: 5, md: 6 }} gap={4}>
                    <Badge
                      alignSelf="flex-start"
                      borderRadius="full"
                      px={3}
                      py={1}
                      bg={section.accent}
                      color="gray.900"
                    >
                      {section.badge}
                    </Badge>
                    <Heading size="lg" color="gray.900">
                      {section.title}
                    </Heading>
                    <Text color="gray.600">{section.description}</Text>
                    <Text
                      mt="auto"
                      fontWeight="700"
                      color="teal.700"
                      display="inline-flex"
                      alignItems="center"
                      gap={2}
                    >
                      Abrir area
                      <FiArrowRight />
                    </Text>
                  </Stack>

                  <Box bg={section.accent} display="flex" alignItems="center" justifyContent="center">
                    <Image src={section.image} alt={section.title} objectFit="contain" h="180px" />
                  </Box>
                </Grid>
              </Box>
            </Link>
          ))}
        </Grid>
      </PageShell>
    </>
  );
}
