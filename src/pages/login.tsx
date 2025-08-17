import { PasswordInput } from "@/components/ui/password-input";
import { useSignIn } from "@/features/auth/hooks/use-auth";
import type { LoginForm } from "@/validations/login-validation";
import { Box, Button, Field, Flex, Heading, Image, Input, Stack, Text } from "@chakra-ui/react";

import { useForm } from "react-hook-form"
export function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>()
  const { signIn, loading } = useSignIn()

  async function handleLogin(data: LoginForm) {
    await signIn(data.email, data.password)
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Stack

        w={{ base: "full", md: "md" }}
        bg="white"
        rounded="xl"
        boxShadow="lg"
        p={{ base: 6, sm: 10 }}
      >
        {/* Logo */}
        <Flex justify="center">
          <Image
            boxSize="50px"
            src="https://dummyimage.com/50x50/00b894/fff.png&text=V"
            alt="Logo"
          />
        </Flex>

        {/* Título */}
        <Stack textAlign="center">
          <Heading fontSize="2xl">Bem-vindo | Balcão</Heading>
          <Text color="gray.600">Faça seu login</Text>
        </Stack>

        {/* Formulário */}
        <Box as="form" onSubmit={handleSubmit(handleLogin)}>
          <Stack >
            <Field.Root>
              <Field.Label>Usuário</Field.Label>
              <Input
                {...register('email')}
              />
              {/* <Field.ErrorText>This field is required</Field.ErrorText> */}
            </Field.Root>

            <Field.Root marginTop={4}>
              <Field.Label>Senha</Field.Label>
              <PasswordInput
                {...register('password')}
              />
              {/* <Field.ErrorText>This field is required</Field.ErrorText> */}
            </Field.Root>

            <Button
              marginTop={6}
              type="submit"
              bg="teal.600"
              color="white"
              _hover={{ bg: "teal.500" }}
              loading={isSubmitting}
            >
              Entrar
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}