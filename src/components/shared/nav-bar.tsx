import { auth } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Livros", href: "/books" },
  { label: "Clientes", href: "/customers" },
  { label: "Pedidos", href: "/orders" },
  { label: "Outras", href: "/others" },
];

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate("/login");
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={30}
      bg="rgba(255,255,255,0.82)"
      backdropFilter="blur(22px)"
      borderBottom="1px solid"
      borderColor="blackAlpha.100"
    >
      <Box maxW="1280px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={4}>
        <Flex direction="column" gap={4}>
          <Flex
            align={{ base: "flex-start", xl: "center" }}
            justify="space-between"
            gap={4}
            flexDirection={{ base: "column", xl: "row" }}
          >
            <Stack gap={1}>
              <HStack gap={3} flexWrap="wrap">
                <Badge colorPalette="teal" variant="solid" px={3} py={1} borderRadius="full">
                  Balcao
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Sistema comercial para catalogo, clientes e pedidos
                </Text>
              </HStack>
              <Heading size="md" color="gray.900">
                Sistema de publicacoes
              </Heading>
            </Stack>

            <HStack
              justify="space-between"
              align="center"
              bg="rgba(255,255,255,0.9)"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="24px"
              px={4}
              py={3}
              shadow="sm"
              minW={{ base: "full", xl: "320px" }}
              gap={4}
            >
              <Stack gap={0} minW={0}>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Sessao ativa
                </Text>
                <Text fontWeight="700" color="gray.900" truncate>
                  {user?.name ?? "Usuario"}
                </Text>
                <Text fontSize="sm" color="gray.500" truncate>
                  {user?.email ?? "Sem email"}
                </Text>
              </Stack>

              <Button
                onClick={handleLogout}
                size="sm"
                borderRadius="full"
                colorPalette="red"
                variant="subtle"
                flexShrink={0}
              >
                <FiLogOut />
                Sair
              </Button>
            </HStack>
          </Flex>

          <Box
            as="nav"
            className="app-hide-scrollbar"
            overflowX="auto"
            overflowY="hidden"
            px={1}
          >
            <HStack
              gap={2}
              minW="max-content"
              bg="rgba(255,255,255,0.82)"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="28px"
              p={2}
              shadow="0 12px 30px rgba(15, 23, 42, 0.06)"
            >
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href);

                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      size="sm"
                      borderRadius="full"
                      px={4}
                      variant={active ? "solid" : "ghost"}
                      colorPalette={active ? "teal" : "gray"}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </HStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
