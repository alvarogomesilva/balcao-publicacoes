import { Navbar } from "@/components/shared/nav-bar";
import { PageShell } from "@/components/shared/page-shell";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Badge,
  Box,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import publicationsImg from "@/assets/publications.png";
import imageSentinela from "@/assets/sentinelas.png";
import imageDespertai from "@/assets/despertais.png";
import imageOutrasPublicacoes from "@/assets/outras_publicacoes.png";
import ordersImg from "@/assets/orders.png";

const sections = [
  {
    title: "Livros",
    description: "Catálogo principal com fluxo completo de cadastro, atualização e estoque.",
    image: publicationsImg,
    href: "/books",
    accent: "#d8fbef",
    badge: "Principal",
  },
  {
    title: "Pedidos",
    description: "Central operacional com movimentações recentes, filtros e visão rápida da operação.",
    image: ordersImg,
    href: "/orders",
    accent: "#fff1d6",
    badge: "Operação",
  },
  {
    title: "Sentinelas",
    description: "Linha dedicada com a mesma base de gestão, pesquisa e movimentação fluida.",
    image: imageSentinela,
    href: "/sentinels",
    accent: "#d8edff",
    badge: "Coleção",
  },
  {
    title: "Despertais",
    description: "Gestão enxuta para títulos Despertai com navegação responsiva e rápida.",
    image: imageDespertai,
    href: "/awaken",
    accent: "#e8ddff",
    badge: "Coleção",
  },
  {
    title: "Outras publicações",
    description: "Área flexível para materiais complementares e itens fora das linhas principais.",
    image: imageOutrasPublicacoes,
    href: "/others",
    accent: "#ffe2d8",
    badge: "Flexível",
  },
];

export function Home() {
  return (
    <>
      <Navbar />
      <PageShell>
        <SectionHeader
          eyebrow="Operação"
          title="Escolha uma área para continuar"
          description="As telas foram reorganizadas para carregar rápido, responder bem no celular e manter o mesmo padrão visual de gestão."
        />

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
          {sections.map((section) => (
            <Link key={section.href} to={section.href}>
              <Box
                h="100%"
                bg="white"
                borderRadius="30px"
                border="1px solid"
                borderColor="blackAlpha.100"
                overflow="hidden"
                shadow="0 24px 50px rgba(15, 23, 42, 0.08)"
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
                      Abrir área
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
