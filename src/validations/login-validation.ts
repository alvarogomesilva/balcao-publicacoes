import z from "zod";

export const loginValidation = z.object({
    email: z.email("Email inválido!"),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres!")
})

export type LoginForm = z.infer<typeof loginValidation>