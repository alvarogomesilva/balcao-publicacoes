import z from "zod";

export const registerPublicationValidation = z.object({
    active: z.boolean(),
    name: z.string().min(1, "Nome é obrigatório"),
    code: z.string()
})

export type RegisterPublication = z.infer<typeof registerPublicationValidation>