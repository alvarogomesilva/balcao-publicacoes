import { PasswordInput } from "@/components/ui/password-input";
import { useSignIn } from "@/features/auth/hooks/use-auth";
import { loginValidation, type LoginForm } from "@/validations/login-validation";
import { Box, Button, Field, Flex, Heading, Image, Input, Stack, Text } from "@chakra-ui/react";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import logoImg from '@/assets/logo.png'

export function Login() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginValidation)
    
  })

  const { signIn } = useSignIn()

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

        <Flex justify="center">
          <Image
            boxSize="50px"
            src={logoImg}
            alt="Logo"
          />
        </Flex>

      
        <Stack textAlign="center">
          <Heading fontSize="2xl">Bem-vindo | Balcão</Heading>
          <Text color="gray.600">Faça seu login</Text>
        </Stack>

      
        <Box as="form" onSubmit={handleSubmit(handleLogin)}>
          <Stack>
            <Field.Root invalid={!!errors.email}>
              <Field.Label>Email</Field.Label>
              <Input
                {...register("email")}
                type="text"
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password} marginTop={4}>
              <Field.Label>Senha</Field.Label>
              <PasswordInput
                {...register("password")}
              />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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
