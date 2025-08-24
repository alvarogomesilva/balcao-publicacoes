import z from "zod";

export const updatePublicationValidation = z.object({
    id: z.string(),
    name: z.string().min(1, "Nome é obrigatório"),
    code: z.string()
})

export type UpdatePublication = z.infer<typeof updatePublicationValidation>