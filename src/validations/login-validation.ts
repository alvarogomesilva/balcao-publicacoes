import z from "zod";

export const loginValidation = z.object({
    email: z.string(),
    password: z.string()
})

export type LoginForm = z.infer<typeof loginValidation>