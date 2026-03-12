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
  { label: "Início", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Livros", href: "/books" },
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
      zIndex={20}
      bg="rgba(255,255,255,0.88)"
      backdropFilter="blur(18px)"
      borderBottom="1px solid"
      borderColor="blackAlpha.100"
    >
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={4}>
        <Flex
          align={{ base: "flex-start", lg: "center" }}
          justify="space-between"
          gap={4}
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Stack gap={1}>
            <HStack gap={3}>
              <Badge
                colorPalette="teal"
                variant="solid"
                px={3}
                py={1}
                borderRadius="full"
              >
                Balcão
              </Badge>
              <Text fontSize="sm" color="gray.500">
                Operação de catálogo e estoque
              </Text>
            </HStack>
            <Heading size="md" color="gray.900">
              Painel de publicações
            </Heading>
          </Stack>

          <Flex
            align={{ base: "stretch", lg: "center" }}
            gap={3}
            w={{ base: "full", lg: "auto" }}
            flexDirection={{ base: "column", lg: "row" }}
          >
            <HStack
              gap={2}
              flexWrap="wrap"
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="full"
              px={2}
              py={2}
              shadow="sm"
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
                      variant={active ? "solid" : "ghost"}
                      colorPalette={active ? "teal" : "gray"}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </HStack>

            <HStack
              justify="space-between"
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.100"
              borderRadius="22px"
              px={4}
              py={3}
              shadow="sm"
              minW={{ base: "full", lg: "260px" }}
            >
              <Stack gap={0}>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase">
                  Sessão ativa
                </Text>
                <Text fontWeight="700" color="gray.900">
                  {user?.name}
                </Text>
              </Stack>

              <Button
                onClick={handleLogout}
                size="sm"
                borderRadius="full"
                colorPalette="red"
                variant="subtle"
              >
                <FiLogOut />
                Sair
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
