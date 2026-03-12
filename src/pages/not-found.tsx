import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router";

export function NotFound() {
  return (
    <Flex minH="100vh" align="center" justify="center" px={4}>
      <Stack
        maxW="520px"
        textAlign="center"
        align="center"
        gap={4}
        p={{ base: 6, md: 8 }}
        borderRadius="28px"
        border="1px solid"
        borderColor="blackAlpha.100"
        bg="rgba(255,255,255,0.82)"
        boxShadow="0 24px 60px rgba(15, 23, 42, 0.08)"
      >
        <Text
          textTransform="uppercase"
          letterSpacing="0.16em"
          fontSize="xs"
          fontWeight="700"
          color="teal.700"
        >
          Erro 404
        </Text>
        <Heading size="xl" color="gray.900">
          Esta tela nao foi encontrada.
        </Heading>
        <Text color="gray.600">
          O endereco acessado nao existe mais ou foi movido. Volte para a pagina inicial para
          continuar navegando.
        </Text>
        <Link to="/">
          <Button bg="teal.600" color="white" _hover={{ bg: "teal.500" }}>
            Ir para o inicio
          </Button>
        </Link>
      </Stack>
    </Flex>
  );
}
