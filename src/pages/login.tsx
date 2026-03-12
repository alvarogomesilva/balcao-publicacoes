import logoImg from "@/assets/logo.png";
import { PasswordInput } from "@/components/ui/password-input";
import { useSignIn } from "@/features/auth/hooks/use-auth";
import { loginValidation, type LoginForm } from "@/validations/login-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginValidation),
  });

  const { signIn } = useSignIn();

  async function handleLogin(data: LoginForm) {
    await signIn(data.email, data.password);
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 10 }}
      bg="transparent"
    >
      <Grid
        w="full"
        maxW="1120px"
        templateColumns={{ base: "1fr", lg: "1.05fr 0.95fr" }}
        borderRadius="34px"
        overflow="hidden"
        border="1px solid"
        borderColor="blackAlpha.100"
        bg="rgba(255,255,255,0.82)"
        boxShadow="0 28px 80px rgba(15, 23, 42, 0.12)"
        backdropFilter="blur(16px)"
      >
        <Flex
          direction="column"
          justify="space-between"
          p={{ base: 6, md: 10 }}
          bg="linear-gradient(135deg, #052f38 0%, #0f766e 52%, #c8faf1 100%)"
          color="white"
          minH={{ base: "auto", lg: "620px" }}
        >
          <Stack gap={6}>
            <HStack gap={3}>
              <Box
                w="52px"
                h="52px"
                borderRadius="18px"
                bg="rgba(255,255,255,0.16)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image boxSize="28px" src={logoImg} alt="Logo" />
              </Box>
              <Stack gap={0}>
                <Text fontSize="sm" color="whiteAlpha.800">
                  Balcao de Publicacoes
                </Text>
                <Heading size="md">Sistema comercial</Heading>
              </Stack>
            </HStack>

            <Stack gap={4}>
              <Heading size={{ base: "xl", md: "2xl" }} lineHeight="1.05">
                Operacao centralizada para catalogo, clientes e pedidos.
              </Heading>
              <Text color="whiteAlpha.900" maxW="480px">
                Entre para acompanhar estoque, registrar vendas, gerenciar clientes e manter o
                fluxo comercial organizado em qualquer tela.
              </Text>
            </Stack>
          </Stack>

          <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={3} mt={10}>
            {[
              ["Catalogo vivo", "Atualize titulos e estoques em tempo real."],
              ["Pedidos", "Crie pedidos com baixa automatica de estoque."],
              ["Clientes", "Mantenha uma base pronta para novas vendas."],
            ].map(([title, description]) => (
              <Box
                key={title}
                borderRadius="20px"
                bg="rgba(255,255,255,0.12)"
                border="1px solid rgba(255,255,255,0.14)"
                p={4}
              >
                <Text fontWeight="800" mb={1}>
                  {title}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.900">
                  {description}
                </Text>
              </Box>
            ))}
          </Grid>
        </Flex>

        <Flex align="center" justify="center" p={{ base: 6, md: 10 }}>
          <Stack w="full" maxW="420px" gap={6}>
            <Stack gap={2}>
              <Text
                textTransform="uppercase"
                letterSpacing="0.14em"
                fontSize="xs"
                fontWeight="700"
                color="teal.700"
              >
                Acesso seguro
              </Text>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.900">
                Entrar no sistema
              </Heading>
              <Text color="gray.600">
                Use seu email cadastrado para acessar o painel operacional.
              </Text>
            </Stack>

            <Box as="form" onSubmit={handleSubmit(handleLogin)}>
              <Stack gap={4}>
                <Field.Root invalid={!!errors.email}>
                  <Field.Label>Email</Field.Label>
                  <Input {...register("email")} type="text" bg="gray.50" />
                  <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.password}>
                  <Field.Label>Senha</Field.Label>
                  <PasswordInput {...register("password")} />
                  <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                </Field.Root>
              </Stack>

              <Button
                mt={6}
                type="submit"
                bg="teal.600"
                color="white"
                _hover={{ bg: "teal.500" }}
                loading={isSubmitting}
                w="full"
                h="48px"
              >
                Entrar
              </Button>
            </Box>
          </Stack>
        </Flex>
      </Grid>
    </Flex>
  );
}
